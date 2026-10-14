from __future__ import annotations

import os
import pickle
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pandas as pd
from mlxtend.frequent_patterns import fpgrowth
from mlxtend.preprocessing import TransactionEncoder
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.booking import Booking
from app.models.destination import Destination
from app.models.tour import Tour
from app.services.recommendation_service import (
    CHECKPOINT_PATH,
    load_checkpoint,
    reload_checkpoint,
)


BACKEND_DIR = Path(__file__).resolve().parents[2]

BASE_DATASET_PATH = (
    BACKEND_DIR
    / "data"
    / "processed"
    / "Vietnam_TourBookings_Filtered_V1.csv"
)

logger_name = "app.services.model_training_service"


def load_base_transactions() -> list[set[str]]:
    """
    Load the original dataset and group destinations by customer.

    Each historical customer contributes one transaction containing
    their unique completed-tour destinations.
    """
    if not BASE_DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Base dataset was not found: {BASE_DATASET_PATH}"
        )

    data = pd.read_csv(BASE_DATASET_PATH)

    required_columns = {
        "customer_id",
        "destination",
        "booking_status",
    }
    missing_columns = required_columns - set(data.columns)

    if missing_columns:
        raise ValueError(
            "Base dataset is missing columns: "
            f"{sorted(missing_columns)}"
        )

    completed_mask = (
        data["booking_status"]
        .astype(str)
        .str.strip()
        .str.lower()
        == "completed"
    )
    data = data.loc[completed_mask].dropna(
        subset=["customer_id"]
    )

    transactions: list[set[str]] = []

    for _, customer_rows in data.groupby(
        "customer_id",
        sort=False,
    ):
        destinations = {
            value.strip()
            for value in customer_rows["destination"]
            if isinstance(value, str) and value.strip()
        }

        if destinations:
            transactions.append(destinations)

    if not transactions:
        raise ValueError(
            "The base dataset contains no valid customer transactions."
        )

    return transactions


def load_live_transactions(db: Session) -> list[set[str]]:
    """
    Build transactions from completed bookings in Vietinerary.

    Database user IDs are kept separate from historical CSV customer IDs,
    because there is no confirmed identity mapping between the two sources.
    """
    statement = (
        select(
            Booking.user_id,
            Destination.name,
        )
        .select_from(Booking)
        .join(Tour, Booking.tour_id == Tour.id)
        .join(
            Destination,
            Tour.destination_id == Destination.id,
        )
        .where(Booking.status == "COMPLETED")
        .order_by(
            Booking.user_id.asc(),
            Booking.created_at.asc(),
            Booking.id.asc(),
        )
    )

    rows = db.execute(statement).all()
    destinations_by_user: dict[int, set[str]] = {}

    for user_id, destination_name in rows:
        if not isinstance(destination_name, str):
            continue

        destination_name = destination_name.strip()

        if not destination_name:
            continue

        destinations_by_user.setdefault(
            user_id,
            set(),
        ).add(destination_name)

    return [
        destinations_by_user[user_id]
        for user_id in sorted(destinations_by_user)
        if destinations_by_user[user_id]
    ]


def build_frequent_itemsets(
    transactions: list[set[str]],
    *,
    min_support: float,
    max_itemset_length: int,
) -> pd.DataFrame:
    """
    Run FP-Growth and preserve the existing checkpoint schema.

    Singleton itemsets are excluded to match the current model, which
    stores patterns containing at least two destinations.
    """
    if not transactions:
        raise ValueError(
            "Cannot train FP-Growth with an empty transaction dataset."
        )

    normalized_transactions = [
        sorted(transaction)
        for transaction in transactions
        if transaction
    ]

    if not normalized_transactions:
        raise ValueError(
            "No valid transactions remain after preprocessing."
        )

    encoder = TransactionEncoder()
    encoded_transactions = encoder.fit(
        normalized_transactions
    ).transform(normalized_transactions)

    transaction_matrix = pd.DataFrame(
        encoded_transactions,
        columns=encoder.columns_,
        dtype=bool,
    )

    frequent_itemsets = fpgrowth(
        transaction_matrix,
        min_support=min_support,
        use_colnames=True,
        max_len=max_itemset_length,
    )

    frequent_itemsets = frequent_itemsets.loc[
        frequent_itemsets["itemsets"].map(len) >= 2
    ]

    records: list[dict[str, Any]] = []
    transaction_count = len(normalized_transactions)

    for _, row in frequent_itemsets.iterrows():
        items = sorted(str(item) for item in row["itemsets"])
        support = float(row["support"])

        records.append(
            {
                "itemset": "{" + ", ".join(items) + "}",
                "itemset_length": len(items),
                "support": support,
                "user_count": int(
                    round(support * transaction_count)
                ),
            }
        )

    result = pd.DataFrame(
        records,
        columns=[
            "itemset",
            "itemset_length",
            "support",
            "user_count",
        ],
    )

    if result.empty:
        return result

    return (
        result.sort_values(
            by=["itemset_length", "support", "itemset"],
            ascending=[True, False, True],
            kind="mergesort",
        )
        .reset_index(drop=True)
    )


def save_checkpoint_atomically(
    checkpoint: dict[str, Any],
) -> None:
    """
    Validate a temporary checkpoint before replacing the active file.
    """
    CHECKPOINT_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    temp_path: Path | None = None

    try:
        with tempfile.NamedTemporaryFile(
            mode="wb",
            prefix="fpgrowth_checkpoint_",
            suffix=".tmp",
            dir=CHECKPOINT_PATH.parent,
            delete=False,
        ) as temp_file:
            temp_path = Path(temp_file.name)

            pickle.dump(
                checkpoint,
                temp_file,
                protocol=pickle.HIGHEST_PROTOCOL,
            )
            temp_file.flush()
            os.fsync(temp_file.fileno())

        # Check the serialized file before touching the active checkpoint.
        validated_checkpoint = load_checkpoint(temp_path)

        if validated_checkpoint["fpgrowth_filtered"].empty:
            raise ValueError(
                "The new checkpoint contains no frequent itemsets. "
                "The current model will be preserved."
            )

        # Atomic replacement prevents a partially written checkpoint.
        os.replace(temp_path, CHECKPOINT_PATH)

        # Swap the in-memory model only after the file has been validated.
        reload_checkpoint(validated_checkpoint)

    finally:
        if temp_path is not None and temp_path.exists():
            temp_path.unlink()


def retrain_model_from_database() -> dict[str, Any]:
    """
    Rebuild the FP-Growth model from the base CSV plus live completed
    bookings, then atomically save and activate the new checkpoint.
    """
    previous_checkpoint = load_checkpoint()

    base_transactions = load_base_transactions()

    db = SessionLocal()
    try:
        live_transactions = load_live_transactions(db)
    finally:
        db.close()

    # The CSV customers and database users are kept as separate transactions.
    transactions = base_transactions + live_transactions

    min_support = float(
        previous_checkpoint.get("min_support", 0.005)
    )
    max_itemset_length = int(
        previous_checkpoint.get("max_itemset_length", 5)
    )

    filtered_itemsets = build_frequent_itemsets(
        transactions,
        min_support=min_support,
        max_itemset_length=max_itemset_length,
    )

    if filtered_itemsets.empty:
        raise ValueError(
            "Training produced no frequent itemsets. "
            "The current checkpoint will be preserved."
        )

    trained_at = datetime.now(timezone.utc).isoformat()

    new_checkpoint = {
        "stage": previous_checkpoint["stage"],
        "created_at": trained_at,
        "algorithm": "FP-Growth",
        "min_support": min_support,
        "max_itemset_length": max_itemset_length,
        "top_k": previous_checkpoint.get("top_k", 5),
        "fpgrowth_filtered": filtered_itemsets,
        "recommendation_policy": previous_checkpoint[
            "recommendation_policy"
        ],
        "base_transaction_count": len(base_transactions),
        "live_user_transaction_count": len(live_transactions),
        "training_transaction_count": len(transactions),
    }

    save_checkpoint_atomically(new_checkpoint)

    return {
        "status": "SUCCESS",
        "created_at": trained_at,
        "base_transaction_count": len(base_transactions),
        "live_user_transaction_count": len(live_transactions),
        "training_transaction_count": len(transactions),
        "frequent_itemset_count": len(filtered_itemsets),
    }
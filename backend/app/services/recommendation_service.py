from __future__ import annotations

import pickle
from pathlib import Path
from typing import Any


BACKEND_DIR = Path(__file__).resolve().parents[2]

CHECKPOINT_PATH = (
    BACKEND_DIR
    / "models"
    / "Vietnam_TourBookings_FPGrowth_Recommendation_V1_Checkpoint.pkl"
)


def load_checkpoint() -> dict[str, Any]:
    """Load and validate the FP-Growth recommendation checkpoint."""
    if not CHECKPOINT_PATH.exists():
        raise FileNotFoundError(
            "FP-Growth checkpoint was not found. "
            f"Expected file: {CHECKPOINT_PATH}"
        )

    with CHECKPOINT_PATH.open("rb") as file:
        checkpoint = pickle.load(file)

    if not isinstance(checkpoint, dict):
        raise TypeError("Checkpoint must be a dictionary.")

    required_keys = {
        "stage",
        "algorithm",
        "fpgrowth_filtered",
        "recommendation_policy",
    }

    missing = required_keys - checkpoint.keys()

    if missing:
        raise KeyError(
            f"Checkpoint is missing required keys: {sorted(missing)}"
        )

    if checkpoint["algorithm"] != "FP-Growth":
        raise ValueError(
            f"Unexpected checkpoint algorithm: {checkpoint['algorithm']}"
        )

    return checkpoint


CHECKPOINT = load_checkpoint()
FPGROWTH_FILTERED = CHECKPOINT["fpgrowth_filtered"]


def parse_itemset(itemset_string: str) -> set[str]:
    """Convert an itemset string such as '{Đà Nẵng, Huế}' into a set."""
    return {
        item.strip()
        for item in itemset_string.strip("{}").split(",")
        if item.strip()
    }


def recommend_fpgrowth(
    history: list[str],
    top_k: int = 5,
) -> dict[str, Any]:
    """
    Generate recommendations using the locked FP-Growth policy.

    Strategy:
    1. Try the full history pattern.
    2. If no result, shorten to a suffix pattern.
    3. Continue until pattern length 1.
    4. Exclude destinations already present in the full history.
    5. Rank by:
       - total support
       - matched pattern count
       - maximum support
       - destination name
    """
    cleaned_history = [
        item.strip()
        for item in history
        if isinstance(item, str) and item.strip()
    ]

    if not cleaned_history:
        return {
            "status": "NO_INPUT",
            "history": [],
            "pattern_used": [],
            "pattern_length": 0,
            "fallback": False,
            "recommendations": [],
        }

    history_set = set(cleaned_history)

    # Full pattern -> shorter suffix -> ... -> length 1
    for pattern_length in range(len(cleaned_history), 0, -1):
        pattern = cleaned_history[-pattern_length:]
        pattern_set = set(pattern)

        matched_rows: list[dict[str, Any]] = []

        for _, row in FPGROWTH_FILTERED.iterrows():
            items = parse_itemset(row["itemset"])

            if pattern_set.issubset(items) and len(items) > pattern_length:
                matched_rows.append(
                    {
                        "itemset": row["itemset"],
                        "support": float(row["support"]),
                        "user_count": int(row["user_count"]),
                    }
                )

        if not matched_rows:
            continue

        # Aggregate candidate scores using the locked recommendation policy.
        candidates: dict[str, dict[str, Any]] = {}

        for matched in matched_rows:
            items = parse_itemset(matched["itemset"])

            for destination in items - history_set:
                entry = candidates.setdefault(
                    destination,
                    {
                        "destination": destination,
                        "score": 0.0,
                        "matched_pattern_count": 0,
                        "max_support": 0.0,
                    },
                )

                entry["score"] += matched["support"]
                entry["matched_pattern_count"] += 1
                entry["max_support"] = max(
                    entry["max_support"],
                    matched["support"],
                )

        if not candidates:
            continue

        ranked = sorted(
            candidates.values(),
            key=lambda item: (
                -item["score"],
                -item["matched_pattern_count"],
                -item["max_support"],
                item["destination"],
            ),
        )[:top_k]

        return {
            "status": "SUCCESS",
            "history": cleaned_history,
            "pattern_used": pattern,
            "pattern_length": pattern_length,
            "fallback": pattern_length < len(cleaned_history),
            "recommendations": ranked,
        }

    return {
        "status": "NO_RECOMMENDATION",
        "history": cleaned_history,
        "pattern_used": [],
        "pattern_length": 0,
        "fallback": True,
        "recommendations": [],
    }


def get_model_info() -> dict[str, Any]:
    """Return metadata about the loaded FP-Growth recommendation model."""
    return {
        "stage": CHECKPOINT["stage"],
        "algorithm": CHECKPOINT["algorithm"],
        "min_support": CHECKPOINT.get("min_support"),
        "max_itemset_length": CHECKPOINT.get("max_itemset_length"),
        "top_k": CHECKPOINT.get("top_k"),
        "frequent_itemset_count": int(len(FPGROWTH_FILTERED)),
    }
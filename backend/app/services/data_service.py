from pathlib import Path

import pandas as pd


BACKEND_DIR = Path(__file__).resolve().parents[2]

DATASET_PATH = (
    BACKEND_DIR
    / "data"
    / "processed"
    / "Vietnam_TourBookings_Filtered_V1.csv"
)


def load_travel_data() -> pd.DataFrame:
    if not DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found: {DATASET_PATH}"
        )

    return pd.read_csv(DATASET_PATH)


def get_destinations() -> list[dict]:
    df = load_travel_data()

    summary = (
        df.groupby("destination")
        .agg(
            booking_count=("booking_id", "count"),
            customer_count=("customer_id", "nunique"),
        )
        .reset_index()
        .sort_values(
            by=["customer_count", "booking_count"],
            ascending=[False, False],
        )
    )

    return summary.to_dict(orient="records")
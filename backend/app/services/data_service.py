from pathlib import Path

import json
import pandas as pd


BACKEND_DIR = Path(__file__).resolve().parents[2]

DATASET_PATH = (
    BACKEND_DIR
    / "data"
    / "processed"
    / "Vietnam_TourBookings_Filtered_V1.csv"
)

CATALOG_PATH = (
    BACKEND_DIR
    / "data"
    / "catalog"
    / "destinations.json"
)


def load_travel_data() -> pd.DataFrame:
    if not DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found: {DATASET_PATH}"
        )

    return pd.read_csv(DATASET_PATH)


def load_destination_catalog() -> list[dict]:
    if not CATALOG_PATH.exists():
        raise FileNotFoundError(
            f"Destination catalog not found: {CATALOG_PATH}"
        )

    with CATALOG_PATH.open("r", encoding="utf-8") as file:
        catalog = json.load(file)

    if not isinstance(catalog, list):
        raise TypeError(
            "Destination catalog must contain a JSON array."
        )

    return catalog


def get_destinations() -> list[dict]:
    df = load_travel_data()
    catalog = load_destination_catalog()

    stats = (
        df.groupby("destination")
        .agg(
            booking_count=("booking_id", "count"),
            customer_count=("customer_id", "nunique"),
        )
        .reset_index()
    )

    stats_by_destination = {
        row["destination"]: {
            "booking_count": int(row["booking_count"]),
            "customer_count": int(row["customer_count"]),
        }
        for _, row in stats.iterrows()
    }

    destinations = []

    for destination in catalog:
        name = destination["name"]

        statistics = stats_by_destination.get(
            name,
            {
                "booking_count": 0,
                "customer_count": 0,
            },
        )

        destinations.append(
            {
                **destination,
                **statistics,
            }
        )

    destinations.sort(
        key=lambda item: (
            -item["customer_count"],
            -item["booking_count"],
        )
    )

    return destinations
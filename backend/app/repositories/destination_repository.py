from __future__ import annotations

import json
from pathlib import Path

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
    """Load processed travel booking data."""
    if not DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Processed travel dataset was not found: {DATASET_PATH}"
        )

    return pd.read_csv(DATASET_PATH)


def load_destination_catalog() -> list[dict]:
    """Load destination metadata from the catalog."""
    if not CATALOG_PATH.exists():
        raise FileNotFoundError(
            f"Destination catalog was not found: {CATALOG_PATH}"
        )

    with CATALOG_PATH.open("r", encoding="utf-8") as file:
        catalog = json.load(file)

    if not isinstance(catalog, list):
        raise TypeError("Destination catalog must be a list.")

    return catalog
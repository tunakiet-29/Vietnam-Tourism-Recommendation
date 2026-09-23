from __future__ import annotations

from app.repositories.destination_repository import (
    load_destination_catalog,
    load_travel_data,
)


def get_destinations() -> list[dict]:
    """
    Build destination data for the API.

    Combines destination metadata from the catalog
    with booking and customer statistics from the dataset.
    """
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
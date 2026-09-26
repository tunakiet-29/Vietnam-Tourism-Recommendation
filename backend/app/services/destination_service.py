from __future__ import annotations

from sqlalchemy.orm import Session

from app.repositories.destination_repository import (
    get_all_destinations,
)


def get_destinations(
    db: Session,
) -> list[dict]:
    destinations = get_all_destinations(db)

    return [
        {
            "id": destination.id,
            "name": destination.name,
            "region": destination.region,
            "description": destination.description,
            "image": destination.image,
            "is_active": destination.is_active,
            "booking_count": 0,
            "customer_count": 0,
        }
        for destination in destinations
    ]
from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.destination import Destination


def get_all_destinations(
    db: Session,
) -> list[Destination]:
    statement = (
        select(Destination)
        .where(Destination.is_active.is_(True))
        .order_by(Destination.name)
    )

    return list(db.scalars(statement).all())


def get_destination_by_id(
    db: Session,
    destination_id: str,
) -> Destination | None:
    return db.get(Destination, destination_id)
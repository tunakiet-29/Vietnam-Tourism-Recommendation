from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.destination import Destination
from app.models.tour import Tour
from app.models.tour_schedule import TourSchedule


def get_all_tours(
    db: Session,
) -> list[Tour]:
    statement = (
        select(Tour)
        .where(Tour.is_active.is_(True))
        .order_by(Tour.id)
    )

    return list(db.scalars(statement).all())


def get_tour_by_id(
    db: Session,
    tour_id: int,
) -> Tour | None:
    return db.get(Tour, tour_id)


def get_tour_destination(
    db: Session,
    destination_id: str,
) -> Destination | None:
    return db.get(Destination, destination_id)


def get_tour_schedules(
    db: Session,
    tour_id: int,
) -> list[TourSchedule]:
    statement = (
        select(TourSchedule)
        .where(
            TourSchedule.tour_id == tour_id,
            TourSchedule.status == "AVAILABLE",
        )
        .order_by(TourSchedule.departure_date)
    )

    return list(db.scalars(statement).all())
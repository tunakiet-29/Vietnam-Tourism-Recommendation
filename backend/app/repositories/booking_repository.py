from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.models.destination import Destination
from app.models.tour import Tour

def get_booking_by_id(
    db: Session,
    booking_id: int,
) -> Booking | None:
    return db.get(Booking, booking_id)


def get_bookings_by_user(
    db: Session,
    user_id: int,
) -> list[Booking]:
    statement = (
        select(Booking)
        .where(Booking.user_id == user_id)
        .order_by(Booking.created_at.desc())
    )

    return list(db.scalars(statement).all())


def get_completed_bookings_by_user(
    db: Session,
    user_id: int,
) -> list[Booking]:
    statement = (
        select(Booking)
        .where(
            Booking.user_id == user_id,
            Booking.status == "COMPLETED",
        )
        .order_by(Booking.created_at.asc())
    )

    return list(db.scalars(statement).all())

def get_travel_history_by_user(
    db: Session,
    user_id: int,
) -> list[str]:
    statement = (
        select(Destination.name)
        .join(Tour, Tour.destination_id == Destination.id)
        .join(Booking, Booking.tour_id == Tour.id)
        .where(
            Booking.user_id == user_id,
            Booking.status == "COMPLETED",
        )
        .order_by(Booking.created_at.asc())
    )

    return list(db.scalars(statement).all())
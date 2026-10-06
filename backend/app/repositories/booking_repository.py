from __future__ import annotations

from datetime import datetime

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.models.destination import Destination
from app.models.tour import Tour
from app.models.user import User

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


def get_expired_pending_bookings(
    db: Session,
    expires_before: datetime,
) -> list[Booking]:
    statement = (
        select(Booking)
        .where(
            Booking.status == "PENDING",
            Booking.expires_at.is_not(None),
            Booking.expires_at <= expires_before,
        )
    )

    return list(db.scalars(statement).all())


def get_admin_bookings(
    db: Session,
    *,
    status: str | None = None,
    search: str | None = None,
) -> list[Booking]:
    statement = select(Booking).join(User)

    if status:
        statement = statement.where(Booking.status == status)

    if search:
        normalized_search = search.strip()

        if normalized_search:
            filters = [
                User.full_name.ilike(f"%{normalized_search}%"),
                User.email.ilike(f"%{normalized_search}%"),
            ]

            if normalized_search.isdigit():
                filters.append(Booking.id == int(normalized_search))

            statement = statement.where(or_(*filters))

    statement = statement.order_by(Booking.created_at.desc())

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

def create_booking(
    db: Session,
    *,
    user_id: int,
    tour_id: int,
    schedule_id: int,
    number_of_guests: int,
    total_amount,
    expires_at: datetime,
) -> Booking:
    booking = Booking(
        user_id=user_id,
        tour_id=tour_id,
        schedule_id=schedule_id,
        number_of_guests=number_of_guests,
        total_amount=total_amount,
        status="PENDING",
        expires_at=expires_at,
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return booking


def update_booking_status(
    db: Session,
    booking: Booking,
    status: str,
) -> Booking:
    booking.status = status

    db.commit()
    db.refresh(booking)

    return booking

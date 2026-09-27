from __future__ import annotations

from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.models.tour import Tour
from app.models.tour_schedule import TourSchedule
from app.repositories.booking_repository import (
    create_booking,
    get_booking_by_id,
    get_bookings_by_user,
    update_booking_status,
)
from app.schemas.booking import BookingCreate


def create_user_booking(
    db: Session,
    user_id: int,
    booking_data: BookingCreate,
) -> Booking:
    tour = db.get(Tour, booking_data.tour_id)

    if tour is None or not tour.is_active:
        raise ValueError("Tour not found or inactive.")

    schedule = db.get(
        TourSchedule,
        booking_data.schedule_id,
    )

    if schedule is None:
        raise ValueError("Tour schedule not found.")

    if schedule.tour_id != tour.id:
        raise ValueError(
            "Schedule does not belong to the selected tour."
        )

    if schedule.status != "AVAILABLE":
        raise ValueError("Tour schedule is not available.")

    if booking_data.number_of_guests > schedule.available_slots:
        raise ValueError("Not enough available slots.")

    total_amount = (
        tour.price
        * Decimal(booking_data.number_of_guests)
    )

    schedule.available_slots -= booking_data.number_of_guests

    booking = create_booking(
        db,
        user_id=user_id,
        tour_id=tour.id,
        schedule_id=schedule.id,
        number_of_guests=booking_data.number_of_guests,
        total_amount=total_amount,
    )

    return booking


def get_user_bookings(
    db: Session,
    user_id: int,
) -> list[Booking]:
    return get_bookings_by_user(
        db,
        user_id,
    )


def get_user_booking_detail(
    db: Session,
    user_id: int,
    booking_id: int,
) -> Booking:
    booking = get_booking_by_id(
        db,
        booking_id,
    )

    if booking is None:
        raise ValueError("Booking not found.")

    if booking.user_id != user_id:
        raise ValueError("You cannot access this booking.")

    return booking


def cancel_user_booking(
    db: Session,
    user_id: int,
    booking_id: int,
) -> Booking:
    booking = get_user_booking_detail(
        db,
        user_id,
        booking_id,
    )

    if booking.status not in {"PENDING", "CONFIRMED"}:
        raise ValueError(
            "Only pending or confirmed bookings can be cancelled."
        )

    schedule = db.get(
        TourSchedule,
        booking.schedule_id,
    )

    if schedule is None:
        raise ValueError("Tour schedule not found.")

    schedule.available_slots += booking.number_of_guests

    return update_booking_status(
        db,
        booking,
        "CANCELLED",
    )
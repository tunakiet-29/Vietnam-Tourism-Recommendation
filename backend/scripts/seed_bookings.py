from __future__ import annotations

from datetime import date, timedelta
from decimal import Decimal

from app.core.database import SessionLocal
from app.models.booking import Booking
from app.models.tour import Tour
from app.models.tour_schedule import TourSchedule
from app.models.user import User


BOOKINGS = [
    {
        "email": "register.test@example.com",
        "tour_title": "Phú Quốc 3N2Đ - Biển Xanh Nghỉ Dưỡng",
        "status": "COMPLETED",
        "number_of_guests": 2,
        "departure_offset_days": -30,
    },
    {
        "email": "register.test@example.com",
        "tour_title": "Đà Nẵng 3N2Đ - Biển Và Thành Phố",
        "status": "COMPLETED",
        "number_of_guests": 2,
        "departure_offset_days": -20,
    },
    {
        "email": "register.test@example.com",
        "tour_title": "Đà Lạt 3N2Đ - Thành Phố Ngàn Hoa",
        "status": "COMPLETED",
        "number_of_guests": 1,
        "departure_offset_days": -10,
    },
    {
        "email": "register.test@example.com",
        "tour_title": "Hà Nội 2N1Đ - Phố Cổ Và Ẩm Thực",
        "status": "CONFIRMED",
        "number_of_guests": 2,
        "departure_offset_days": 14,
    },
    {
        "email": "register.test@example.com",
        "tour_title": "Nha Trang 3N2Đ - Biển Xanh",
        "status": "PENDING",
        "number_of_guests": 1,
        "departure_offset_days": 21,
    },
    {
        "email": "register.test@example.com",
        "tour_title": "Hội An 2N1Đ - Phố Cổ Và Đèn Lồng",
        "status": "CANCELLED",
        "number_of_guests": 2,
        "departure_offset_days": 28,
    },
]


def get_or_create_schedule(
    db,
    tour: Tour,
    departure_date: date,
    status: str,
) -> TourSchedule:
    schedule = (
        db.query(TourSchedule)
        .filter(
            TourSchedule.tour_id == tour.id,
            TourSchedule.departure_date == departure_date,
        )
        .first()
    )

    if schedule is not None:
        return schedule

    schedule_status = (
        "COMPLETED"
        if departure_date < date.today()
        else "AVAILABLE"
    )

    schedule = TourSchedule(
        tour_id=tour.id,
        departure_date=departure_date,
        available_slots=tour.max_guests,
        status=schedule_status,
    )

    db.add(schedule)
    db.flush()

    return schedule


def seed_bookings() -> None:
    db = SessionLocal()

    try:
        created_count = 0
        updated_count = 0

        for data in BOOKINGS:
            user = (
                db.query(User)
                .filter(User.email == data["email"])
                .first()
            )

            if user is None:
                raise ValueError(
                    f"User not found: {data['email']}"
                )

            tour = (
                db.query(Tour)
                .filter(Tour.title == data["tour_title"])
                .first()
            )

            if tour is None:
                raise ValueError(
                    f"Tour not found: {data['tour_title']}"
                )

            departure_date = (
                date.today()
                + timedelta(days=data["departure_offset_days"])
            )

            schedule = get_or_create_schedule(
                db,
                tour,
                departure_date,
                data["status"],
            )

            total_amount = (
                tour.price
                * data["number_of_guests"]
            )

            existing_booking = (
                db.query(Booking)
                .filter(
                    Booking.user_id == user.id,
                    Booking.tour_id == tour.id,
                    Booking.schedule_id == schedule.id,
                )
                .first()
            )

            if existing_booking is None:
                booking = Booking(
                    user_id=user.id,
                    tour_id=tour.id,
                    schedule_id=schedule.id,
                    number_of_guests=data["number_of_guests"],
                    total_amount=Decimal(total_amount),
                    status=data["status"],
                )

                db.add(booking)
                created_count += 1
            else:
                existing_booking.number_of_guests = (
                    data["number_of_guests"]
                )
                existing_booking.total_amount = Decimal(total_amount)
                existing_booking.status = data["status"]
                updated_count += 1

        db.commit()

        print(f"Created: {created_count}")
        print(f"Updated: {updated_count}")
        print(f"Total bookings: {len(BOOKINGS)}")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_bookings()
from datetime import date, timedelta

from app.core.database import SessionLocal
from app.models.tour import Tour
from app.models.tour_schedule import TourSchedule


def seed_tour_schedules() -> None:
    db = SessionLocal()

    try:
        tours = db.query(Tour).order_by(Tour.id).all()

        created_count = 0

        base_date = date.today() + timedelta(days=14)

        for index, tour in enumerate(tours):
            first_date = base_date + timedelta(days=index * 3)
            second_date = first_date + timedelta(days=14)

            schedules = [
                {
                    "tour_id": tour.id,
                    "departure_date": first_date,
                    "available_slots": tour.max_guests,
                    "status": "AVAILABLE",
                },
                {
                    "tour_id": tour.id,
                    "departure_date": second_date,
                    "available_slots": tour.max_guests,
                    "status": "AVAILABLE",
                },
            ]

            for schedule_data in schedules:
                existing = (
                    db.query(TourSchedule)
                    .filter(
                        TourSchedule.tour_id == schedule_data["tour_id"],
                        TourSchedule.departure_date
                        == schedule_data["departure_date"],
                    )
                    .first()
                )

                if existing is None:
                    db.add(TourSchedule(**schedule_data))
                    created_count += 1

        db.commit()

        print(f"Created: {created_count}")
        print(f"Total schedules: {len(tours) * 2}")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_tour_schedules()
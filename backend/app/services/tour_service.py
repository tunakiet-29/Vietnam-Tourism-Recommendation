from __future__ import annotations

from sqlalchemy.orm import Session

from app.models.tour import Tour
from app.models.tour_schedule import TourSchedule
from app.repositories.tour_repository import (
    get_all_tours,
    get_tour_by_id,
    get_tour_destination,
    get_tour_schedules,
)


def list_tours(
    db: Session,
) -> list[dict]:
    tours = get_all_tours(db)

    result = []

    for tour in tours:
        destination = get_tour_destination(
            db,
            tour.destination_id,
        )

        result.append(
            {
                "id": tour.id,
                "title": tour.title,
                "description": tour.description,
                "destination_id": tour.destination_id,
                "destination_name": (
                    destination.name
                    if destination is not None
                    else None
                ),
                "duration_days": tour.duration_days,
                "price": tour.price,
                "max_guests": tour.max_guests,
                "rating": tour.rating,
                "image": tour.image,
                "status": tour.status,
            }
        )

    return result


def get_tour_detail(
    db: Session,
    tour_id: int,
) -> dict | None:
    tour = get_tour_by_id(
        db,
        tour_id,
    )

    if tour is None or not tour.is_active:
        return None

    destination = get_tour_destination(
        db,
        tour.destination_id,
    )

    schedules = get_tour_schedules(
        db,
        tour.id,
    )

    return {
        "id": tour.id,
        "title": tour.title,
        "description": tour.description,
        "destination_id": tour.destination_id,
        "destination_name": (
            destination.name
            if destination is not None
            else None
        ),
        "duration_days": tour.duration_days,
        "price": tour.price,
        "max_guests": tour.max_guests,
        "rating": tour.rating,
        "image": tour.image,
        "status": tour.status,
        "schedules": [
            {
                "id": schedule.id,
                "departure_date": schedule.departure_date,
                "available_slots": schedule.available_slots,
                "status": schedule.status,
            }
            for schedule in schedules
        ],
    }


def get_tour_schedule_list(
    db: Session,
    tour_id: int,
) -> list[TourSchedule]:
    tour = get_tour_by_id(
        db,
        tour_id,
    )

    if tour is None or not tour.is_active:
        return []

    return get_tour_schedules(
        db,
        tour_id,
    )
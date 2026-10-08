from __future__ import annotations

from sqlalchemy.orm import Session

from app.models.tour import Tour
from app.repositories.admin_tour_repository import (
    create_admin_tour as create_admin_tour_record,
    get_admin_tour_by_id,
    get_admin_tours,
    update_admin_tour as update_admin_tour_record,
    update_admin_tour_status as update_admin_tour_status_record,
)
from app.repositories.destination_repository import (
    get_destination_by_id,
)
from app.schemas.admin_tour import (
    AdminTourCreate,
    AdminTourUpdate,
)


def _get_destination_or_raise(
    db: Session,
    destination_id: str,
):
    destination = get_destination_by_id(
        db,
        destination_id,
    )

    if destination is None:
        raise ValueError("Destination not found.")

    if not destination.is_active:
        raise ValueError("Destination is inactive.")

    return destination


def _serialize_admin_tour(
    db: Session,
    tour: Tour,
) -> dict:
    destination = get_destination_by_id(
        db,
        tour.destination_id,
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
        "is_active": tour.is_active,
        "created_at": tour.created_at,
        "updated_at": tour.updated_at,
    }


def list_admin_tours(
    db: Session,
    *,
    search: str | None = None,
    status: str | None = None,
    is_active: bool | None = None,
    destination_id: str | None = None,
) -> list[dict]:
    tours = get_admin_tours(
        db,
        search=search,
        status=status,
        is_active=is_active,
        destination_id=destination_id,
    )

    return [
        _serialize_admin_tour(db, tour)
        for tour in tours
    ]


def get_admin_tour_detail(
    db: Session,
    tour_id: int,
) -> dict:
    tour = get_admin_tour_by_id(
        db,
        tour_id,
    )

    if tour is None:
        raise ValueError("Tour not found.")

    return _serialize_admin_tour(
        db,
        tour,
    )


def create_admin_tour(
    db: Session,
    tour_data: AdminTourCreate,
) -> dict:
    _get_destination_or_raise(
        db,
        tour_data.destination_id,
    )

    tour = create_admin_tour_record(
        db,
        title=tour_data.title.strip(),
        description=tour_data.description.strip(),
        destination_id=tour_data.destination_id,
        duration_days=tour_data.duration_days,
        price=tour_data.price,
        max_guests=tour_data.max_guests,
        image=tour_data.image.strip(),
    )

    return _serialize_admin_tour(
        db,
        tour,
    )


def update_admin_tour(
    db: Session,
    tour_id: int,
    tour_data: AdminTourUpdate,
) -> dict:
    tour = get_admin_tour_by_id(
        db,
        tour_id,
    )

    if tour is None:
        raise ValueError("Tour not found.")

    _get_destination_or_raise(
        db,
        tour_data.destination_id,
    )

    updated_tour = update_admin_tour_record(
        db,
        tour=tour,
        title=tour_data.title.strip(),
        description=tour_data.description.strip(),
        destination_id=tour_data.destination_id,
        duration_days=tour_data.duration_days,
        price=tour_data.price,
        max_guests=tour_data.max_guests,
        image=tour_data.image.strip(),
    )

    return _serialize_admin_tour(
        db,
        updated_tour,
    )


def update_admin_tour_status(
    db: Session,
    tour_id: int,
    is_active: bool,
) -> dict:
    tour = get_admin_tour_by_id(
        db,
        tour_id,
    )

    if tour is None:
        raise ValueError("Tour not found.")

    if is_active:
        _get_destination_or_raise(
            db,
            tour.destination_id,
        )

    updated_tour = update_admin_tour_status_record(
        db,
        tour=tour,
        is_active=is_active,
    )

    return _serialize_admin_tour(
        db,
        updated_tour,
    )
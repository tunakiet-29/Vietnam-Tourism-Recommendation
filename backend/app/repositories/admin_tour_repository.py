from __future__ import annotations

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.destination import Destination
from app.models.tour import Tour


def get_admin_tours(
    db: Session,
    *,
    search: str | None = None,
    status: str | None = None,
    is_active: bool | None = None,
    destination_id: str | None = None,
) -> list[Tour]:
    statement = (
        select(Tour)
        .join(
            Destination,
            Tour.destination_id == Destination.id,
        )
    )

    if search:
        normalized_search = search.strip()

        if normalized_search:
            search_pattern = f"%{normalized_search}%"

            statement = statement.where(
                or_(
                    Tour.title.ilike(search_pattern),
                    Tour.description.ilike(search_pattern),
                    Destination.name.ilike(search_pattern),
                )
            )

    if status:
        statement = statement.where(
            Tour.status == status.upper(),
        )

    if is_active is not None:
        statement = statement.where(
            Tour.is_active.is_(is_active),
        )

    if destination_id:
        statement = statement.where(
            Tour.destination_id == destination_id,
        )

    statement = statement.order_by(
        Tour.created_at.desc(),
        Tour.id.desc(),
    )

    return list(db.scalars(statement).all())


def get_admin_tour_by_id(
    db: Session,
    tour_id: int,
) -> Tour | None:
    return db.get(Tour, tour_id)


def create_admin_tour(
    db: Session,
    *,
    title: str,
    description: str,
    destination_id: str,
    duration_days: int,
    price: Decimal,
    max_guests: int,
    image: str,
) -> Tour:
    tour = Tour(
        title=title,
        description=description,
        destination_id=destination_id,
        duration_days=duration_days,
        price=price,
        max_guests=max_guests,
        rating=0,
        image=image,
        status="ACTIVE",
        is_active=True,
    )

    db.add(tour)
    db.commit()
    db.refresh(tour)

    return tour


def update_admin_tour(
    db: Session,
    *,
    tour: Tour,
    title: str,
    description: str,
    destination_id: str,
    duration_days: int,
    price: Decimal,
    max_guests: int,
    image: str,
) -> Tour:
    tour.title = title
    tour.description = description
    tour.destination_id = destination_id
    tour.duration_days = duration_days
    tour.price = price
    tour.max_guests = max_guests
    tour.image = image

    db.commit()
    db.refresh(tour)

    return tour


def update_admin_tour_status(
    db: Session,
    *,
    tour: Tour,
    is_active: bool,
) -> Tour:
    tour.is_active = is_active
    tour.status = "ACTIVE" if is_active else "INACTIVE"

    db.commit()
    db.refresh(tour)

    return tour
from sqlalchemy.orm import Session

from app.repositories.booking_repository import (
    get_travel_history_by_user,
)


def get_user_travel_history(
    db: Session,
    user_id: int,
) -> list[str]:
    return get_travel_history_by_user(
        db,
        user_id,
    )
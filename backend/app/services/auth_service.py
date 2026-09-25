from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.user import User
from app.repositories.user_repository import (
    create_user,
    get_user_by_email,
)
from app.schemas.user import UserCreate


def register_user(
    db: Session,
    user_data: UserCreate,
) -> User:
    existing_user = get_user_by_email(
        db,
        user_data.email,
    )

    if existing_user is not None:
        raise ValueError("Email is already registered.")

    password_hash = hash_password(user_data.password)

    return create_user(
        db,
        full_name=user_data.full_name,
        email=user_data.email,
        password_hash=password_hash,
    )


def authenticate_user(
    db: Session,
    email: str,
    password: str,
) -> User | None:
    user = get_user_by_email(
        db,
        email,
    )

    if user is None:
        return None

    if not user.is_active:
        return None

    if not verify_password(
        password,
        user.password_hash,
    ):
        return None

    return user
from __future__ import annotations

import argparse

from app.core.database import SessionLocal
from app.repositories.user_repository import get_user_by_email


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Update a user's application role."
    )
    parser.add_argument("email")
    parser.add_argument(
        "role",
        choices=["admin", "user"],
        default="admin",
        nargs="?",
    )
    args = parser.parse_args()

    db = SessionLocal()

    try:
        user = get_user_by_email(db, args.email)

        if user is None:
            raise SystemExit("User not found.")

        user.role = args.role
        db.commit()
        print(f"Updated {user.email} to role '{user.role}'.")
    finally:
        db.close()


if __name__ == "__main__":
    main()

"""add payment expiry fields

Revision ID: c3f0a4d2e7b1
Revises: bae6d2a84194
Create Date: 2026-10-05 10:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c3f0a4d2e7b1"
down_revision: Union[str, Sequence[str], None] = "bae6d2a84194"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "bookings",
        sa.Column("expires_at", sa.DateTime(), nullable=True),
    )
    op.create_index(
        op.f("ix_bookings_expires_at"),
        "bookings",
        ["expires_at"],
        unique=False,
    )
    op.add_column(
        "payments",
        sa.Column("checkout_url", sa.String(length=2048), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("payments", "checkout_url")
    op.drop_index(op.f("ix_bookings_expires_at"), table_name="bookings")
    op.drop_column("bookings", "expires_at")

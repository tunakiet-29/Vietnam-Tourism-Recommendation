from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Tour(Base):
    __tablename__ = "tours"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    destination_id: Mapped[str] = mapped_column(
        String(50),
        ForeignKey("destinations.id"),
        nullable=False,
        index=True,
    )

    duration_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    price: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    max_guests: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    rating: Mapped[Decimal] = mapped_column(
        Numeric(3, 2),
        default=0,
        nullable=False,
    )

    image: Mapped[str] = mapped_column(
        String(500),
        default="",
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="ACTIVE",
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )
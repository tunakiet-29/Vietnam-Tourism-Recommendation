from __future__ import annotations

from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class TourSchedule(Base):
    __tablename__ = "tour_schedules"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    tour_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("tours.id"),
        nullable=False,
        index=True,
    )

    departure_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    available_slots: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="AVAILABLE",
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
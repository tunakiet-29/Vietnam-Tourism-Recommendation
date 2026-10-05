from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.booking import Booking


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    booking_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("bookings.id"),
        nullable=False,
        index=True,
    )

    booking: Mapped["Booking"] = relationship(
        back_populates="payments",
    )

    txn_ref: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True,
        index=True,
    )

    amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="PENDING",
        nullable=False,
    )

    checkout_url: Mapped[str | None] = mapped_column(
        String(2048),
        nullable=True,
    )

    vnp_response_code: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    vnp_transaction_status: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    vnp_transaction_no: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    vnp_bank_code: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    vnp_pay_date: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
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

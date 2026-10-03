from __future__ import annotations

from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.payment import Payment


def get_payment_by_id(
    db: Session,
    payment_id: int,
) -> Payment | None:
    return db.get(Payment, payment_id)


def get_payment_by_txn_ref(
    db: Session,
    txn_ref: str,
) -> Payment | None:
    statement = (
        select(Payment)
        .where(Payment.txn_ref == txn_ref)
    )

    return db.scalars(statement).first()


def create_payment(
    db: Session,
    *,
    booking_id: int,
    txn_ref: str,
    amount: Decimal,
) -> Payment:
    payment = Payment(
        booking_id=booking_id,
        txn_ref=txn_ref,
        amount=amount,
        status="PENDING",
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment
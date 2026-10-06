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


def get_pending_payment_by_booking_id(
    db: Session,
    booking_id: int,
) -> Payment | None:
    statement = (
        select(Payment)
        .where(
            Payment.booking_id == booking_id,
            Payment.status == "PENDING",
        )
        .order_by(Payment.created_at.desc())
    )

    return db.scalars(statement).first()


def get_latest_payment_by_booking_id(
    db: Session,
    booking_id: int,
) -> Payment | None:
    statement = (
        select(Payment)
        .where(Payment.booking_id == booking_id)
        .order_by(Payment.created_at.desc())
    )

    return db.scalars(statement).first()


def create_payment(
    db: Session,
    *,
    booking_id: int,
    txn_ref: str,
    amount: Decimal,
    checkout_url: str,
) -> Payment:
    payment = Payment(
        booking_id=booking_id,
        txn_ref=txn_ref,
        amount=amount,
        status="PENDING",
        checkout_url=checkout_url,
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment


def update_payment(
    db: Session,
    *,
    payment: Payment,
    status: str,
    vnp_response_code: str | None = None,
    vnp_transaction_status: str | None = None,
    vnp_transaction_no: str | None = None,
    vnp_bank_code: str | None = None,
    vnp_pay_date: str | None = None,
) -> Payment:
    payment.status = status
    payment.vnp_response_code = vnp_response_code
    payment.vnp_transaction_status = vnp_transaction_status
    payment.vnp_transaction_no = vnp_transaction_no
    payment.vnp_bank_code = vnp_bank_code
    payment.vnp_pay_date = vnp_pay_date

    db.commit()
    db.refresh(payment)

    return payment

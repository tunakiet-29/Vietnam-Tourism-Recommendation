from __future__ import annotations

import hashlib
import hmac
import uuid
from datetime import datetime
from decimal import Decimal
from urllib.parse import urlencode
from zoneinfo import ZoneInfo

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.booking import Booking
from app.models.payment import Payment
from app.repositories.booking_repository import get_booking_by_id
from app.repositories.payment_repository import create_payment


VN_TIMEZONE = ZoneInfo("Asia/Ho_Chi_Minh")


def _generate_txn_ref(booking_id: int) -> str:
    return f"BK{booking_id}{uuid.uuid4().hex}"


def _generate_secure_hash(params: dict[str, str]) -> str:
    hash_data = urlencode(sorted(params.items()))

    secure_hash = hmac.new(
        settings.vnpay_hash_secret.encode("utf-8"),
        hash_data.encode("utf-8"),
        hashlib.sha512,
    ).hexdigest()

    return secure_hash


def _build_vnpay_payment_url(
    *,
    txn_ref: str,
    amount: Decimal,
    order_info: str,
    client_ip: str,
) -> str:
    create_date = datetime.now(VN_TIMEZONE).strftime(
        "%Y%m%d%H%M%S"
    )

    vnp_amount = int(amount * 100)

    params = {
        "vnp_Version": "2.1.0",
        "vnp_Command": "pay",
        "vnp_TmnCode": settings.vnpay_tmn_code,
        "vnp_Amount": str(vnp_amount),
        "vnp_CurrCode": "VND",
        "vnp_TxnRef": txn_ref,
        "vnp_OrderInfo": order_info,
        "vnp_OrderType": "other",
        "vnp_Locale": "vn",
        "vnp_ReturnUrl": settings.vnpay_return_url,
        "vnp_IpAddr": client_ip,
        "vnp_CreateDate": create_date,
    }

    secure_hash = _generate_secure_hash(params)

    params["vnp_SecureHash"] = secure_hash

    query_string = urlencode(params)

    return f"{settings.vnpay_payment_url}?{query_string}"


def create_vnpay_payment(
    db: Session,
    *,
    user_id: int,
    booking_id: int,
    client_ip: str,
) -> tuple[Payment, str]:
    booking = get_booking_by_id(
        db,
        booking_id,
    )

    if booking is None:
        raise ValueError("Booking not found.")

    if booking.user_id != user_id:
        raise ValueError(
            "You cannot access this booking."
        )

    if booking.status not in {"PENDING", "CONFIRMED"}:
        raise ValueError(
            "This booking cannot be paid."
        )

    txn_ref = _generate_txn_ref(booking.id)

    order_info = (
        f"Thanh toan booking {booking.id}"
    )

    payment_url = _build_vnpay_payment_url(
        txn_ref=txn_ref,
        amount=booking.total_amount,
        order_info=order_info,
        client_ip=client_ip,
    )

    payment = create_payment(
        db,
        booking_id=booking.id,
        txn_ref=txn_ref,
        amount=booking.total_amount,
    )

    return payment, payment_url
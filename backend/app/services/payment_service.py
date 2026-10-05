from __future__ import annotations

import hashlib
import hmac
import uuid
from datetime import datetime, timezone
from decimal import Decimal
from urllib.parse import urlencode
from zoneinfo import ZoneInfo

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.payment import Payment
from app.repositories.booking_repository import (
    get_booking_by_id,
    update_booking_status,
)
from app.repositories.payment_repository import (
    create_payment,
    get_payment_by_txn_ref,
    get_pending_payment_by_booking_id,
    update_payment,
)
from app.services.booking_service import expire_pending_bookings


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


def verify_vnpay_signature(
    params: dict[str, str],
) -> bool:
    received_hash = params.get("vnp_SecureHash")

    if not received_hash:
        return False

    hash_params = {
        key: value
        for key, value in params.items()
        if key not in {
            "vnp_SecureHash",
            "vnp_SecureHashType",
        }
    }

    calculated_hash = _generate_secure_hash(hash_params)

    return hmac.compare_digest(
        calculated_hash.lower(),
        received_hash.lower(),
    )


def _build_vnpay_payment_url(
    *,
    txn_ref: str,
    amount: Decimal,
    order_info: str,
    client_ip: str,
    expires_at: datetime | None,
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

    if expires_at is not None:
        expires_at_vn = expires_at.replace(
            tzinfo=timezone.utc
        ).astimezone(VN_TIMEZONE)
        params["vnp_ExpireDate"] = expires_at_vn.strftime(
            "%Y%m%d%H%M%S"
        )

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
    expire_pending_bookings(db)

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

    if booking.status != "PENDING":
        raise ValueError(
            "This booking cannot be paid."
        )

    active_payment = get_pending_payment_by_booking_id(
        db,
        booking.id,
    )

    if active_payment is not None and active_payment.checkout_url:
        return active_payment, active_payment.checkout_url

    if active_payment is not None:
        update_payment(
            db,
            payment=active_payment,
            status="EXPIRED",
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
        expires_at=booking.expires_at,
    )

    payment = create_payment(
        db,
        booking_id=booking.id,
        txn_ref=txn_ref,
        amount=booking.total_amount,
        checkout_url=payment_url,
    )

    return payment, payment_url


def get_user_payment_status(
    db: Session,
    *,
    user_id: int,
    txn_ref: str,
) -> Payment:
    expire_pending_bookings(db)

    payment = get_payment_by_txn_ref(
        db,
        txn_ref,
    )

    if payment is None:
        raise ValueError("Payment not found.")

    booking = get_booking_by_id(
        db,
        payment.booking_id,
    )

    if booking is None or booking.user_id != user_id:
        raise ValueError("You cannot access this payment.")

    return payment


def process_vnpay_ipn(
    db: Session,
    *,
    params: dict[str, str],
) -> tuple[str, str]:
    if not verify_vnpay_signature(params):
        return "97", "Invalid Signature"

    txn_ref = params.get("vnp_TxnRef")

    if not txn_ref:
        return "01", "Order not found"

    payment = get_payment_by_txn_ref(
        db,
        txn_ref,
    )

    if payment is None:
        return "01", "Order not found"

    expire_pending_bookings(db)

    amount_raw = params.get("vnp_Amount")

    try:
        vnp_amount = int(amount_raw or "0")
    except ValueError:
        return "04", "Invalid Amount"

    expected_amount = int(payment.amount * 100)

    if vnp_amount != expected_amount:
        return "04", "Invalid Amount"

    response_code = params.get(
        "vnp_ResponseCode",
        "",
    )

    transaction_status = params.get(
        "vnp_TransactionStatus",
        "",
    )

    is_success = (
        response_code == "00"
        and transaction_status == "00"
    )

    # Payment đã được xử lý trước đó.
    # Nếu đã PAID thì không xử lý lại giao dịch.
    if payment.status != "PENDING":
        # Đảm bảo Booking đã được CONFIRMED nếu
        # Payment đã PAID nhưng lần trước chưa đồng bộ Booking.
        if payment.status == "PAID":
            booking = get_booking_by_id(
                db,
                payment.booking_id,
            )

            if booking is not None and booking.status == "PENDING":
                update_booking_status(
                    db,
                    booking,
                    "CONFIRMED",
                )

        return "02", "Order already confirmed"

    payment_status = (
        "PAID"
        if is_success
        else "FAILED"
    )

    update_payment(
        db,
        payment=payment,
        status=payment_status,
        vnp_response_code=response_code,
        vnp_transaction_status=transaction_status,
        vnp_transaction_no=params.get(
            "vnp_TransactionNo"
        ),
        vnp_bank_code=params.get(
            "vnp_BankCode"
        ),
        vnp_pay_date=params.get(
            "vnp_PayDate"
        ),
    )

    # Chỉ xác nhận Booking khi thanh toán thành công.
    if payment_status == "PAID":
        booking = get_booking_by_id(
            db,
            payment.booking_id,
        )

        if booking is not None and booking.status in {
            "PENDING",
            "CONFIRMED",
        }:
            update_booking_status(
                db,
                booking,
                "CONFIRMED",
            )

    return "00", "Confirm Success"

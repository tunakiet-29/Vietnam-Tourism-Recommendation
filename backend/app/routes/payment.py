from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.payment import PaymentResponse
from app.services.payment_service import (
    create_vnpay_payment,
    process_vnpay_ipn,
)


router = APIRouter(
    prefix="/api/v1/payments",
    tags=["Payments"],
)


@router.get("/vnpay/ipn")
def vnpay_ipn(
    request: Request,
    db: Session = Depends(get_db),
) -> dict[str, str]:
    params = dict(request.query_params)

    rsp_code, message = process_vnpay_ipn(
        db,
        params=params,
    )

    return {
        "RspCode": rsp_code,
        "Message": message,
    }


@router.post(
    "/vnpay/{booking_id}",
    response_model=PaymentResponse,
)
def create_vnpay_payment_endpoint(
    booking_id: int,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PaymentResponse:
    client_ip = (
        request.client.host
        if request.client is not None
        else "127.0.0.1"
    )

    try:
        payment, payment_url = create_vnpay_payment(
            db,
            user_id=current_user.id,
            booking_id=booking_id,
            client_ip=client_ip,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    return PaymentResponse(
        id=payment.id,
        booking_id=payment.booking_id,
        txn_ref=payment.txn_ref,
        amount=payment.amount,
        status=payment.status,
        payment_url=payment_url,
    )
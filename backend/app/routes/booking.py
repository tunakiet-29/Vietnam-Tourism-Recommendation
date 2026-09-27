from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingResponse
from app.services.booking_service import (
    cancel_user_booking,
    create_user_booking,
    get_user_booking_detail,
    get_user_bookings,
)


router = APIRouter(
    prefix="/api/v1/bookings",
    tags=["Bookings"],
)


@router.post(
    "",
    response_model=BookingResponse,
    status_code=201,
)
def create_booking(
    booking_data: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BookingResponse:
    try:
        booking = create_user_booking(
            db,
            current_user.id,
            booking_data,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    return BookingResponse.model_validate(booking)


@router.get(
    "/me",
    response_model=list[BookingResponse],
)
def list_my_bookings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[BookingResponse]:
    bookings = get_user_bookings(
        db,
        current_user.id,
    )

    return [
        BookingResponse.model_validate(booking)
        for booking in bookings
    ]


@router.get(
    "/{booking_id}",
    response_model=BookingResponse,
)
def get_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BookingResponse:
    try:
        booking = get_user_booking_detail(
            db,
            current_user.id,
            booking_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc

    return BookingResponse.model_validate(booking)


@router.patch(
    "/{booking_id}/cancel",
    response_model=BookingResponse,
)
def cancel_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BookingResponse:
    try:
        booking = cancel_user_booking(
            db,
            current_user.id,
            booking_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    return BookingResponse.model_validate(booking)
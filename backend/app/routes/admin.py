from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.user import User
from app.schemas.booking import AdminBookingResponse
from app.services.booking_service import (
    complete_admin_booking,
    get_admin_booking_list,
)


router = APIRouter(
    prefix="/api/v1/admin/bookings",
    tags=["Admin Bookings"],
)


@router.get("", response_model=list[AdminBookingResponse])
def list_admin_bookings(
    status: str | None = None,
    payment_status: str | None = None,
    search: str | None = Query(default=None, max_length=255),
    _: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> list[dict]:
    return get_admin_booking_list(
        db,
        status=status,
        payment_status=payment_status,
        search=search,
    )


@router.patch(
    "/{booking_id}/complete",
    response_model=AdminBookingResponse,
)
def complete_booking(
    booking_id: int,
    _: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict:
    try:
        complete_admin_booking(db, booking_id)
        bookings = get_admin_booking_list(
            db,
            search=str(booking_id),
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    if not bookings:
        raise HTTPException(status_code=404, detail="Booking not found.")

    return bookings[0]

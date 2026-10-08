from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.user import User
from app.schemas.admin_tour import (
    AdminTourCreate,
    AdminTourResponse,
    AdminTourStatusUpdate,
    AdminTourUpdate,
)
from app.services.admin_tour_service import (
    create_admin_tour,
    get_admin_tour_detail,
    list_admin_tours,
    update_admin_tour,
    update_admin_tour_status,
)


router = APIRouter(
    prefix="/api/v1/admin/tours",
    tags=["Admin Tours"],
)


@router.get(
    "",
    response_model=list[AdminTourResponse],
)
def get_admin_tour_list(
    search: str | None = Query(
        default=None,
        max_length=255,
    ),
    status: str | None = Query(
        default=None,
        max_length=20,
    ),
    is_active: bool | None = None,
    destination_id: str | None = Query(
        default=None,
        max_length=50,
    ),
    _: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> list[dict]:
    return list_admin_tours(
        db,
        search=search,
        status=status,
        is_active=is_active,
        destination_id=destination_id,
    )


@router.post(
    "",
    response_model=AdminTourResponse,
    status_code=201,
)
def create_tour(
    tour_data: AdminTourCreate,
    _: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict:
    try:
        return create_admin_tour(
            db,
            tour_data,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc


@router.get(
    "/{tour_id}",
    response_model=AdminTourResponse,
)
def get_tour(
    tour_id: int,
    _: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict:
    try:
        return get_admin_tour_detail(
            db,
            tour_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc


@router.put(
    "/{tour_id}",
    response_model=AdminTourResponse,
)
def update_tour(
    tour_id: int,
    tour_data: AdminTourUpdate,
    _: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict:
    try:
        return update_admin_tour(
            db,
            tour_id,
            tour_data,
        )
    except ValueError as exc:
        if str(exc) == "Tour not found.":
            raise HTTPException(
                status_code=404,
                detail=str(exc),
            ) from exc

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc


@router.patch(
    "/{tour_id}/status",
    response_model=AdminTourResponse,
)
def update_tour_status(
    tour_id: int,
    status_data: AdminTourStatusUpdate,
    _: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict:
    try:
        return update_admin_tour_status(
            db,
            tour_id,
            status_data.is_active,
        )
    except ValueError as exc:
        if str(exc) == "Tour not found.":
            raise HTTPException(
                status_code=404,
                detail=str(exc),
            ) from exc

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc
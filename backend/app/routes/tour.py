from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.tour import (
    TourListItem,
    TourResponse,
    TourScheduleResponse,
)
from app.services.tour_service import (
    get_tour_detail,
    get_tour_schedule_list,
    list_tours,
)


router = APIRouter(
    prefix="/api/v1/tours",
    tags=["Tours"],
)


@router.get(
    "",
    response_model=list[TourListItem],
)
def get_tours(
    db: Session = Depends(get_db),
) -> list[TourListItem]:
    tours = list_tours(db)

    return [
        TourListItem.model_validate(tour)
        for tour in tours
    ]


@router.get(
    "/{tour_id}",
    response_model=TourResponse,
)
def get_tour(
    tour_id: int,
    db: Session = Depends(get_db),
) -> TourResponse:
    tour = get_tour_detail(
        db,
        tour_id,
    )

    if tour is None:
        raise HTTPException(
            status_code=404,
            detail="Tour not found.",
        )

    return TourResponse.model_validate(tour)


@router.get(
    "/{tour_id}/schedules",
    response_model=list[TourScheduleResponse],
)
def get_schedules(
    tour_id: int,
    db: Session = Depends(get_db),
) -> list[TourScheduleResponse]:
    tour = get_tour_detail(
        db,
        tour_id,
    )

    if tour is None:
        raise HTTPException(
            status_code=404,
            detail="Tour not found.",
        )

    schedules = get_tour_schedule_list(
        db,
        tour_id,
    )

    return [
        TourScheduleResponse.model_validate(schedule)
        for schedule in schedules
    ]
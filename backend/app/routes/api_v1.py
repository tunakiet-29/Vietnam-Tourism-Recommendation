from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.recommendation import (
    RecommendationRequest,
    RecommendationResponse,
)
from app.services.destination_service import get_destinations
from app.services.recommendation_service import (
    get_model_info,
    recommend_fpgrowth,
)
from app.services.travel_history_service import get_user_travel_history

router = APIRouter(
    prefix="/api/v1",
    tags=["API v1"],
)


@router.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "algorithm": "FP-Growth",
    }


@router.get("/model-info")
def model_info() -> dict[str, Any]:
    return get_model_info()


@router.get("/destinations")
def list_destinations(
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    destinations = get_destinations(db)

    return {
        "status": "SUCCESS",
        "count": len(destinations),
        "destinations": destinations,
    }


@router.post(
    "/recommendations",
    response_model=RecommendationResponse,
)
def recommend(
    request: RecommendationRequest,
) -> RecommendationResponse:
    try:
        result = recommend_fpgrowth(
            request.history,
            request.top_k,
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Recommendation failed: {exc}",
        ) from exc

    return RecommendationResponse(
        algorithm="FP-Growth",
        **result,
    )

@router.get(
    "/recommendations/me",
    response_model=RecommendationResponse,
)
def recommend_for_current_user(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> RecommendationResponse:
    history = get_user_travel_history(
        db,
        current_user.id,
    )

    try:
        result = recommend_fpgrowth(
            history,
            5,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Recommendation failed: {exc}",
        ) from exc

    return RecommendationResponse(
        algorithm="FP-Growth",
        **result,
    )
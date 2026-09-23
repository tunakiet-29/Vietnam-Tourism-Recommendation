from fastapi import APIRouter, HTTPException

from app.schemas.recommendation import (
    RecommendationRequest,
    RecommendationResponse,
)
from app.services.recommendation_service import recommend_fpgrowth


router = APIRouter(
    prefix="/recommend",
    tags=["Recommendations"],
)


@router.post("", response_model=RecommendationResponse)
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
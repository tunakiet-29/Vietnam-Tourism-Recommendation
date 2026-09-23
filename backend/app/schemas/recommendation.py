from pydantic import BaseModel, Field


class RecommendationRequest(BaseModel):
    history: list[str] = Field(
        ...,
        min_length=1,
        description="Ordered travel history",
    )
    top_k: int = Field(default=5, ge=1, le=20)


class RecommendationItem(BaseModel):
    destination: str
    score: float
    matched_pattern_count: int
    max_support: float


class RecommendationResponse(BaseModel):
    status: str
    algorithm: str
    history: list[str]
    pattern_used: list[str]
    pattern_length: int
    fallback: bool
    recommendations: list[RecommendationItem]
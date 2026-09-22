
from __future__ import annotations

import pickle
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from app.routes.destinations import router as destinations_router
BASE_DIR = Path(__file__).resolve().parent.parent
CHECKPOINT_PATH = (
    BASE_DIR
    / "models"
    / "Vietnam_TourBookings_FPGrowth_Recommendation_V1_Checkpoint.pkl"
)


class RecommendationRequest(BaseModel):
    history: list[str] = Field(..., min_length=1, description="Ordered travel history")
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


def load_checkpoint() -> dict[str, Any]:
    if not CHECKPOINT_PATH.exists():
        raise FileNotFoundError(
            "FP-Growth checkpoint was not found. "
            f"Expected file: {CHECKPOINT_PATH}"
        )

    with CHECKPOINT_PATH.open("rb") as file:
        checkpoint = pickle.load(file)

    if not isinstance(checkpoint, dict):
        raise TypeError("Checkpoint must be a dictionary.")

    required_keys = {
        "stage",
        "algorithm",
        "fpgrowth_filtered",
        "recommendation_policy",
    }
    missing = required_keys - checkpoint.keys()
    if missing:
        raise KeyError(f"Checkpoint is missing required keys: {sorted(missing)}")

    if checkpoint["algorithm"] != "FP-Growth":
        raise ValueError(
            f"Unexpected checkpoint algorithm: {checkpoint['algorithm']}"
        )

    return checkpoint


CHECKPOINT = load_checkpoint()
FPGROWTH_FILTERED = CHECKPOINT["fpgrowth_filtered"]


def parse_itemset(itemset_string: str) -> set[str]:
    return {
        item.strip()
        for item in itemset_string.strip("{}").split(",")
        if item.strip()
    }


def recommend_fpgrowth(history: list[str], top_k: int = 5) -> dict[str, Any]:
    cleaned_history = [
        item.strip()
        for item in history
        if isinstance(item, str) and item.strip()
    ]

    if not cleaned_history:
        return {
            "status": "NO_INPUT",
            "history": [],
            "pattern_used": [],
            "pattern_length": 0,
            "fallback": False,
            "recommendations": [],
        }

    history_set = set(cleaned_history)

    # Full pattern -> shorter suffix -> ... -> length 1
    for pattern_length in range(len(cleaned_history), 0, -1):
        pattern = cleaned_history[-pattern_length:]
        pattern_set = set(pattern)

        matched_rows: list[dict[str, Any]] = []

        for _, row in FPGROWTH_FILTERED.iterrows():
            items = parse_itemset(row["itemset"])
            if pattern_set.issubset(items) and len(items) > pattern_length:
                matched_rows.append(
                    {
                        "itemset": row["itemset"],
                        "support": float(row["support"]),
                        "user_count": int(row["user_count"]),
                    }
                )

        if not matched_rows:
            continue

        # Aggregate candidate scores using the same locked demo policy.
        candidates: dict[str, dict[str, Any]] = {}

        for matched in matched_rows:
            items = parse_itemset(matched["itemset"])
            for destination in items - history_set:
                entry = candidates.setdefault(
                    destination,
                    {
                        "destination": destination,
                        "score": 0.0,
                        "matched_pattern_count": 0,
                        "max_support": 0.0,
                    },
                )
                entry["score"] += matched["support"]
                entry["matched_pattern_count"] += 1
                entry["max_support"] = max(
                    entry["max_support"], matched["support"]
                )

        if not candidates:
            continue

        ranked = sorted(
            candidates.values(),
            key=lambda item: (
                -item["score"],
                -item["matched_pattern_count"],
                -item["max_support"],
                item["destination"],
            ),
        )[:top_k]

        return {
            "status": "SUCCESS",
            "history": cleaned_history,
            "pattern_used": pattern,
            "pattern_length": pattern_length,
            "fallback": pattern_length < len(cleaned_history),
            "recommendations": ranked,
        }

    return {
        "status": "NO_RECOMMENDATION",
        "history": cleaned_history,
        "pattern_used": [],
        "pattern_length": 0,
        "fallback": True,
        "recommendations": [],
    }


app = FastAPI(
    title="Vietnam Tourism Recommendation API",
    version="1.0.0",
    description="FP-Growth recommendation service with suffix pattern backoff.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(destinations_router)

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "algorithm": "FP-Growth"}


@app.get("/model-info")
def model_info() -> dict[str, Any]:
    return {
        "stage": CHECKPOINT["stage"],
        "algorithm": CHECKPOINT["algorithm"],
        "min_support": CHECKPOINT.get("min_support"),
        "max_itemset_length": CHECKPOINT.get("max_itemset_length"),
        "top_k": CHECKPOINT.get("top_k"),
        "frequent_itemset_count": int(len(FPGROWTH_FILTERED)),
    }


@app.post("/recommend", response_model=RecommendationResponse)
def recommend(request: RecommendationRequest) -> RecommendationResponse:
    try:
        result = recommend_fpgrowth(request.history, request.top_k)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Recommendation failed: {exc}",
        ) from exc

    return RecommendationResponse(algorithm="FP-Growth", **result)

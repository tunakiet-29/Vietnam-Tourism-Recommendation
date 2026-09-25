from __future__ import annotations
from typing import Any
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.destinations import router as destinations_router
from app.routes.recommendations import router as recommendations_router
from app.services.recommendation_service import get_model_info
from app.routes.api_v1 import router as api_v1_router
from app.routes.auth import router as auth_router
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
app.include_router(recommendations_router)
app.include_router(api_v1_router)
app.include_router(auth_router)

@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "algorithm": "FP-Growth",
    }


@app.get("/model-info")
def model_info() -> dict[str, Any]:
    return get_model_info()
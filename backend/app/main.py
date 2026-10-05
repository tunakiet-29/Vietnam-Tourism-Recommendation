from __future__ import annotations

import asyncio
import logging
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.destinations import router as destinations_router
from app.routes.recommendations import router as recommendations_router
from app.services.recommendation_service import get_model_info
from app.routes.api_v1 import router as api_v1_router
from app.routes.auth import router as auth_router
from app.routes.booking import router as booking_router
from app.routes.payment import router as payment_router
from app.routes.tour import router as tour_router
from app.core.config import settings
from app.core.database import SessionLocal
from app.services.booking_service import expire_pending_bookings


logger = logging.getLogger(__name__)


async def expire_pending_bookings_task() -> None:
    while True:
        db = SessionLocal()

        try:
            expire_pending_bookings(db)
        except Exception:
            logger.exception("Failed to expire pending bookings.")
        finally:
            db.close()

        await asyncio.sleep(
            settings.payment_expiry_check_interval_seconds
        )


@asynccontextmanager
async def lifespan(_: FastAPI):
    expiry_task = asyncio.create_task(
        expire_pending_bookings_task()
    )

    try:
        yield
    finally:
        expiry_task.cancel()

        try:
            await expiry_task
        except asyncio.CancelledError:
            pass


app = FastAPI(
    title="Vietnam Tourism Recommendation API",
    version="1.0.0",
    description="FP-Growth recommendation service with suffix pattern backoff.",
    lifespan=lifespan,
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
app.include_router(tour_router)
app.include_router(booking_router)
app.include_router(payment_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "algorithm": "FP-Growth",
    }


@app.get("/model-info")
def model_info() -> dict[str, Any]:
    return get_model_info()

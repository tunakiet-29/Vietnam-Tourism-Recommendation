from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class AdminTourCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    destination_id: str = Field(
        ...,
        min_length=1,
        max_length=50,
    )
    duration_days: int = Field(..., gt=0)
    price: Decimal = Field(..., ge=0)
    max_guests: int = Field(..., gt=0)
    image: str = Field(
        default="",
        max_length=500,
    )


class AdminTourUpdate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    destination_id: str = Field(
        ...,
        min_length=1,
        max_length=50,
    )
    duration_days: int = Field(..., gt=0)
    price: Decimal = Field(..., ge=0)
    max_guests: int = Field(..., gt=0)
    image: str = Field(
        default="",
        max_length=500,
    )


class AdminTourStatusUpdate(BaseModel):
    is_active: bool


class AdminTourResponse(BaseModel):
    id: int
    title: str
    description: str
    destination_id: str
    destination_name: str | None
    duration_days: int
    price: Decimal
    max_guests: int
    rating: Decimal
    image: str
    status: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
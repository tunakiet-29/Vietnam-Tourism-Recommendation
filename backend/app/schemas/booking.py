from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class BookingCreate(BaseModel):
    tour_id: int = Field(..., gt=0)
    schedule_id: int = Field(..., gt=0)
    number_of_guests: int = Field(..., gt=0)


class BookingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    tour_id: int
    schedule_id: int
    number_of_guests: int
    total_amount: Decimal
    status: str
    created_at: datetime
    updated_at: datetime
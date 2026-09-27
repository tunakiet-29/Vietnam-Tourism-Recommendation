from __future__ import annotations

from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class TourListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

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


class TourScheduleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    departure_date: date
    available_slots: int
    status: str


class TourResponse(TourListItem):
    schedules: list[TourScheduleResponse] = []
from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class PaymentResponse(BaseModel):
    id: int
    booking_id: int
    txn_ref: str
    amount: Decimal
    status: str
    payment_url: str


class PaymentStatusResponse(BaseModel):
    id: int
    booking_id: int
    txn_ref: str
    amount: Decimal
    status: str
    created_at: datetime
    updated_at: datetime

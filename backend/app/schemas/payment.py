from __future__ import annotations

from decimal import Decimal

from pydantic import BaseModel


class PaymentResponse(BaseModel):
    id: int
    booking_id: int
    txn_ref: str
    amount: Decimal
    status: str
    payment_url: str
from fastapi import APIRouter, HTTPException

from app.services.destination_service import get_destinations


router = APIRouter(
    prefix="/destinations",
    tags=["Destinations"],
)


@router.get("")
def list_destinations():
    try:
        destinations = get_destinations()

        return {
            "status": "SUCCESS",
            "count": len(destinations),
            "destinations": destinations,
        }

    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        ) from exc
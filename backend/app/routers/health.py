from fastapi import APIRouter

from app.api import HealthResponse
from app.utils import rfc3339

health_router = APIRouter()


@health_router.get(
    "/health", summary="Health", response_model=HealthResponse, include_in_schema=False
)
async def check_health():
    """
    Check API health
    """
    return {"ok": True, "ts": rfc3339()}

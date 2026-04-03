from fastapi import APIRouter
from services.analytics_service import analytics_service

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard():
    """Returns analytics totals for the UI """
    return await analytics_service.get_dashboard_stats()
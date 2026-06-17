from fastapi import APIRouter
from typing import Optional

router = APIRouter()

ALERTS = [
    {"id": 1, "type": "critical", "title": "Research Publications Critical",  "message": "RPC score 7.3 pts below target. Urgent faculty push needed.", "category": "RPC", "created_at": "2025-06-09"},
    {"id": 2, "type": "warning",  "title": "Placement Rate Declining",         "message": "Placement rate dropped 2.1% vs last quarter.",              "category": "GO",  "created_at": "2025-06-09"},
    {"id": 3, "type": "warning",  "title": "Faculty Qualification Gap",         "message": "PhD faculty ratio at 66.7%, target is 75%.",                "category": "TLR", "created_at": "2025-06-08"},
    {"id": 4, "type": "info",     "title": "Patent Milestone Approaching",      "message": "28 patents filed. Target 30 by Dec 2024.",                  "category": "RPC", "created_at": "2025-06-08"},
    {"id": 5, "type": "success",  "title": "Citations Milestone Achieved",      "message": "Total citations crossed 8,000 milestone!",                  "category": "RPC", "created_at": "2025-06-07"},
]


@router.get("/")
async def get_alerts(type: Optional[str] = None, category: Optional[str] = None, limit: int = 20):
    filtered = ALERTS
    if type:
        filtered = [a for a in filtered if a["type"] == type]
    if category:
        filtered = [a for a in filtered if a["category"] == category]
    return {"alerts": filtered[:limit], "total": len(filtered), "critical_count": sum(1 for a in ALERTS if a["type"] == "critical")}


@router.post("/{alert_id}/resolve")
async def resolve_alert(alert_id: int):
    return {"message": f"Alert {alert_id} marked as resolved", "alert_id": alert_id}


@router.post("/{alert_id}/dismiss")
async def dismiss_alert(alert_id: int):
    return {"message": f"Alert {alert_id} dismissed", "alert_id": alert_id}

from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from typing import Literal

router = APIRouter()

AVAILABLE_REPORTS = [
    {"id": "nirf_readiness",    "title": "NIRF Readiness Report 2024–25",        "type": "PDF",  "category": "NIRF"},
    {"id": "ranking_improvement","title": "Ranking Improvement Report",            "type": "PDF",  "category": "Analytics"},
    {"id": "department_perf",   "title": "Department Performance Report",          "type": "Excel","category": "Department"},
    {"id": "benchmarking",      "title": "Benchmarking Report — Top 5 Inst.",     "type": "PDF",  "category": "Benchmark"},
    {"id": "gap_analysis",      "title": "Gap Analysis Report",                    "type": "PDF",  "category": "AI"},
    {"id": "executive_summary", "title": "Executive Summary — Board Presentation", "type": "PPTX", "category": "Executive"},
    {"id": "faculty_research",  "title": "Faculty Research Output Report",         "type": "Excel","category": "Research"},
    {"id": "accreditation",     "title": "Accreditation Readiness Report",         "type": "PDF",  "category": "NAAC"},
    {"id": "strategic_roadmap", "title": "Strategic 3-Year Roadmap",               "type": "PDF",  "category": "Strategic"},
]


class GenerateReportRequest(BaseModel):
    report_id: str
    format: Literal["pdf", "excel", "pptx"] = "pdf"
    include_charts: bool = True
    year: int = 2024


@router.get("/list")
async def list_reports():
    return {"reports": AVAILABLE_REPORTS}


@router.post("/generate")
async def generate_report(req: GenerateReportRequest, background_tasks: BackgroundTasks):
    report = next((r for r in AVAILABLE_REPORTS if r["id"] == req.report_id), None)
    if not report:
        return {"error": "Report not found"}
    # In production: trigger background Celery task for PDF/Excel generation
    task_id = f"report_{req.report_id}_{req.year}"
    return {
        "message": f"Report '{report['title']}' generation started",
        "task_id": task_id,
        "estimated_time_seconds": 15,
        "download_url": f"/api/reports/download/{task_id}",
    }


@router.get("/download/{task_id}")
async def download_report(task_id: str):
    # In production: return actual file or signed S3 URL
    return {"status": "ready", "download_url": f"/files/{task_id}.pdf", "expires_in": 3600}

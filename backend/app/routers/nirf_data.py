from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import date

router = APIRouter()


class NIRFDataSummary(BaseModel):
    institution_name: str
    year: int
    tlr_score: float
    rpc_score: float
    go_score: float
    oi_score: float
    pr_score: float
    total_score: float
    rank: Optional[int]
    naac_grade: Optional[str]


@router.get("/summary")
async def get_nirf_summary(institution_id: str = "default", year: int = 2024):
    return NIRFDataSummary(
        institution_name="Shoolini University",
        year=year,
        tlr_score=22.1, rpc_score=21.5, go_score=16.2, oi_score=7.3, pr_score=7.4,
        total_score=74.5, rank=47, naac_grade="A+",
    )


@router.get("/history")
async def get_nirf_history(institution_id: str = "default", years: int = 6):
    data = [
        {"year": 2019, "tlr": 18.2, "rpc": 14.5, "go": 12.8, "oi": 6.1, "pr": 5.2, "total": 56.8, "rank": 112},
        {"year": 2020, "tlr": 19.8, "rpc": 16.2, "go": 13.5, "oi": 6.4, "pr": 5.8, "total": 61.7, "rank": 89},
        {"year": 2021, "tlr": 21.3, "rpc": 18.1, "go": 14.2, "oi": 6.7, "pr": 6.3, "total": 66.6, "rank": 72},
        {"year": 2022, "tlr": 22.5, "rpc": 19.4, "go": 15.1, "oi": 7.0, "pr": 6.8, "total": 70.8, "rank": 61},
        {"year": 2023, "tlr": 21.8, "rpc": 20.2, "go": 15.8, "oi": 7.2, "pr": 7.1, "total": 72.1, "rank": 52},
        {"year": 2024, "tlr": 22.1, "rpc": 21.5, "go": 16.2, "oi": 7.3, "pr": 7.4, "total": 74.5, "rank": 47},
    ]
    return {"institution": "Shoolini University", "history": data[-years:]}


@router.get("/departments")
async def get_department_data(institution_id: str = "default"):
    return {
        "departments": [
            {"name": "Engineering",    "tlr": 23.1, "rpc": 24.2, "go": 17.8, "oi": 7.5, "pr": 7.8, "total": 80.4},
            {"name": "Sciences",       "tlr": 24.5, "rpc": 26.1, "go": 15.2, "oi": 8.1, "pr": 7.2, "total": 81.1},
            {"name": "Management",     "tlr": 21.2, "rpc": 16.8, "go": 18.9, "oi": 7.2, "pr": 8.4, "total": 72.5},
            {"name": "Pharmacy",       "tlr": 22.8, "rpc": 22.4, "go": 16.1, "oi": 7.8, "pr": 6.9, "total": 76.0},
            {"name": "Law",            "tlr": 18.4, "rpc": 13.2, "go": 15.8, "oi": 6.9, "pr": 7.1, "total": 61.4},
            {"name": "Biotechnology",  "tlr": 23.4, "rpc": 24.8, "go": 14.5, "oi": 8.4, "pr": 6.8, "total": 77.9},
        ]
    }


@router.get("/kpis")
async def get_kpis(institution_id: str = "default"):
    return {
        "total_faculty": 297, "phd_faculty": 198, "total_students": 3560,
        "publications": 1248, "citations": 8942, "h_index": 42,
        "patents": 34, "consultancy_revenue": 4200000,
        "placement_rate": 88.4, "median_salary": 680000,
        "international_students": 42, "women_students": 1420,
    }

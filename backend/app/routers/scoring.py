from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from app.services.nirf_scoring import (
    NIRFScoringEngine, TLRInput, RPCInput, GOInput, OIInput, PRInput
)

router = APIRouter()
engine = NIRFScoringEngine()


class TLRRequest(BaseModel):
    total_faculty: int = Field(..., ge=1)
    phd_faculty: int = Field(..., ge=0)
    total_students: int = Field(..., ge=1)
    avg_experience_years: float = Field(..., ge=0)
    financial_resources_inr: float = Field(..., ge=0)
    library_expenditure_inr: float = Field(..., ge=0)
    lab_expenditure_inr: float = Field(..., ge=0)


class RPCRequest(BaseModel):
    scopus_papers: int = Field(..., ge=0)
    wos_papers: int = Field(..., ge=0)
    total_citations: int = Field(..., ge=0)
    h_index: int = Field(..., ge=0)
    patents_filed: int = Field(default=0, ge=0)
    patents_granted: int = Field(default=0, ge=0)
    consultancy_revenue_inr: float = Field(default=0.0, ge=0)
    sponsored_projects_count: int = Field(default=0, ge=0)
    sponsored_amount_inr: float = Field(default=0.0, ge=0)
    total_faculty: int = Field(default=1, ge=1)


class GORequest(BaseModel):
    total_graduates: int = Field(..., ge=1)
    placed_industry: int = Field(default=0, ge=0)
    higher_studies: int = Field(default=0, ge=0)
    self_employed: int = Field(default=0, ge=0)
    median_salary_inr: float = Field(..., ge=0)
    phd_graduates: int = Field(default=0, ge=0)
    phd_faculty: int = Field(default=0, ge=0)
    total_faculty: int = Field(default=1, ge=1)


class OIRequest(BaseModel):
    total_students: int = Field(..., ge=1)
    women_students: int = Field(default=0, ge=0)
    ews_students: int = Field(default=0, ge=0)
    sc_students: int = Field(default=0, ge=0)
    st_students: int = Field(default=0, ge=0)
    obc_students: int = Field(default=0, ge=0)
    physically_disabled: int = Field(default=0, ge=0)
    international_students: int = Field(default=0, ge=0)
    states_represented: int = Field(default=1, ge=1)


class PRRequest(BaseModel):
    academic_reputation_score: float = Field(..., ge=0, le=100)
    employer_reputation_score: float = Field(..., ge=0, le=100)
    alumni_engagement_score: float = Field(default=50.0, ge=0, le=100)
    media_visibility_score: float = Field(default=50.0, ge=0, le=100)


class FullNIRFRequest(BaseModel):
    tlr: TLRRequest
    rpc: RPCRequest
    go: GORequest
    oi: OIRequest
    pr: PRRequest


@router.post("/calculate/tlr")
async def calculate_tlr(req: TLRRequest):
    score = engine.calculate_tlr(TLRInput(**req.model_dump()))
    return {"parameter": "TLR", "score": score, "max": 30, "percentage": round((score/30)*100, 1)}


@router.post("/calculate/rpc")
async def calculate_rpc(req: RPCRequest):
    data = req.model_dump()
    faculty = data.pop("total_faculty")
    score = engine.calculate_rpc(RPCInput(**data), total_faculty=faculty)
    return {"parameter": "RPC", "score": score, "max": 30, "percentage": round((score/30)*100, 1)}


@router.post("/calculate/go")
async def calculate_go(req: GORequest):
    score = engine.calculate_go(GOInput(**req.model_dump()))
    return {"parameter": "GO", "score": score, "max": 20, "percentage": round((score/20)*100, 1)}


@router.post("/calculate/oi")
async def calculate_oi(req: OIRequest):
    score = engine.calculate_oi(OIInput(**req.model_dump()))
    return {"parameter": "OI", "score": score, "max": 10, "percentage": round((score/10)*100, 1)}


@router.post("/calculate/pr")
async def calculate_pr(req: PRRequest):
    score = engine.calculate_pr(PRInput(**req.model_dump()))
    return {"parameter": "PR", "score": score, "max": 10, "percentage": round((score/10)*100, 1)}


@router.post("/calculate/full")
async def calculate_full_nirf(req: FullNIRFRequest):
    rpc_data = req.rpc.model_dump()
    faculty_count = req.tlr.total_faculty

    result = engine.calculate_all(
        tlr=TLRInput(**req.tlr.model_dump()),
        rpc=RPCInput(**{k: v for k, v in rpc_data.items() if k != "total_faculty"}),
        go=GOInput(**req.go.model_dump()),
        oi=OIInput(**req.oi.model_dump()),
        pr=PRInput(**req.pr.model_dump()),
    )
    return {
        "scores": {"tlr": result.tlr, "rpc": result.rpc, "go": result.go, "oi": result.oi, "pr": result.pr},
        "total": result.total,
        "estimated_rank": result.estimated_rank,
        "parameter_percentages": result.parameter_percentages,
        "improvement_potential": result.improvement_potential,
    }

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from app.services.rank_prediction import RankPredictionEngine, HistoricalDataPoint

router = APIRouter()
engine = RankPredictionEngine()

HISTORICAL_DATA = [
    HistoricalDataPoint(year=2019, tlr=18.2, rpc=14.5, go=12.8, oi=6.1, pr=5.2, total=56.8, rank=112),
    HistoricalDataPoint(year=2020, tlr=19.8, rpc=16.2, go=13.5, oi=6.4, pr=5.8, total=61.7, rank=89),
    HistoricalDataPoint(year=2021, tlr=21.3, rpc=18.1, go=14.2, oi=6.7, pr=6.3, total=66.6, rank=72),
    HistoricalDataPoint(year=2022, tlr=22.5, rpc=19.4, go=15.1, oi=7.0, pr=6.8, total=70.8, rank=61),
    HistoricalDataPoint(year=2023, tlr=21.8, rpc=20.2, go=15.8, oi=7.2, pr=7.1, total=72.1, rank=52),
    HistoricalDataPoint(year=2024, tlr=22.1, rpc=21.5, go=16.2, oi=7.3, pr=7.4, total=74.5, rank=47),
]


class PredictionRequest(BaseModel):
    years_ahead: int = 3
    rpc_push: Optional[float] = 0.0      # Additional RPC improvement points
    faculty_hire: Optional[float] = 0.0  # Additional TLR improvement
    patent_push: Optional[float] = 0.0  # Additional patent contribution


@router.get("/forecast")
async def get_forecast(years: int = 4):
    predictions = engine.predict_future(HISTORICAL_DATA, years_ahead=years)
    return {
        "institution": "Shoolini University",
        "current": {"score": 74.5, "rank": 47, "year": 2024},
        "predictions": [
            {
                "year": p.year, "predicted_score": p.predicted_score,
                "predicted_rank": p.predicted_rank, "confidence": p.confidence,
                "lower_bound": p.lower_bound, "upper_bound": p.upper_bound,
            }
            for p in predictions
        ],
    }


@router.post("/simulate")
async def simulate_improvement(req: PredictionRequest):
    actions = {
        "rpc_push": req.rpc_push or 0,
        "faculty_hire": req.faculty_hire or 0,
        "patent_push": req.patent_push or 0,
    }
    predictions = engine.predict_future(HISTORICAL_DATA, years_ahead=req.years_ahead, improvement_actions=actions)
    baseline     = engine.predict_future(HISTORICAL_DATA, years_ahead=req.years_ahead)

    return {
        "optimistic": [{"year": p.year, "score": p.predicted_score, "rank": p.predicted_rank, "confidence": p.confidence} for p in predictions],
        "baseline":   [{"year": p.year, "score": p.predicted_score, "rank": p.predicted_rank, "confidence": p.confidence} for p in baseline],
        "improvement_impact": {
            "year_1": round(predictions[0].predicted_score - baseline[0].predicted_score, 2),
            "rank_gain_year_1": baseline[0].predicted_rank - predictions[0].predicted_rank,
        },
    }

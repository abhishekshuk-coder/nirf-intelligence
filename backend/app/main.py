"""
NIRF Intelligence & Ranking Analytics Platform — FastAPI Backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.routers import auth, nirf_data, scoring, benchmarking, prediction, reports, ai_copilot, alerts

app = FastAPI(
    title="NIRF Intelligence Platform API",
    description="Enterprise NIRF Ranking Analytics & Intelligence Platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,         prefix="/api/auth",         tags=["Authentication"])
app.include_router(nirf_data.router,    prefix="/api/nirf",         tags=["NIRF Data"])
app.include_router(scoring.router,      prefix="/api/scoring",      tags=["Scoring Engine"])
app.include_router(benchmarking.router, prefix="/api/benchmark",    tags=["Benchmarking"])
app.include_router(prediction.router,   prefix="/api/prediction",   tags=["Rank Prediction"])
app.include_router(reports.router,      prefix="/api/reports",      tags=["Reports"])
app.include_router(ai_copilot.router,   prefix="/api/ai",           tags=["AI Copilot"])
app.include_router(alerts.router,       prefix="/api/alerts",       tags=["Alerts"])

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0", "platform": "NIRF Intelligence"}

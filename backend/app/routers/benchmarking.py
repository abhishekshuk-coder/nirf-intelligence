from fastapi import APIRouter

router = APIRouter()

BENCHMARK_DATA = {
    "IIT Madras":     {"tlr": 28.5, "rpc": 28.8, "go": 19.2, "oi": 8.1, "pr": 9.9, "total": 94.5, "rank": 1},
    "IISc Bengaluru": {"tlr": 27.9, "rpc": 29.3, "go": 18.5, "oi": 7.8, "pr": 9.7, "total": 93.2, "rank": 2},
    "IIT Bombay":     {"tlr": 28.1, "rpc": 28.1, "go": 19.0, "oi": 7.9, "pr": 9.5, "total": 92.6, "rank": 3},
    "IIT Delhi":      {"tlr": 27.8, "rpc": 27.9, "go": 18.8, "oi": 7.7, "pr": 9.4, "total": 91.6, "rank": 4},
    "IIM Ahmedabad":  {"tlr": 26.5, "rpc": 25.2, "go": 19.5, "oi": 7.2, "pr": 9.8, "total": 88.2, "rank": 5},
}

MY_SCORES = {"tlr": 22.1, "rpc": 21.5, "go": 16.2, "oi": 7.3, "pr": 7.4, "total": 74.5, "rank": 47}


@router.get("/institutions")
async def get_benchmark_institutions():
    return {"institutions": list(BENCHMARK_DATA.keys())}


@router.get("/compare")
async def compare_with_benchmark(institution: str = "IIT Madras"):
    if institution not in BENCHMARK_DATA:
        return {"error": f"Benchmark data for '{institution}' not found"}
    bench = BENCHMARK_DATA[institution]
    gaps     = {p: round(MY_SCORES[p] - bench[p], 2) for p in ["tlr","rpc","go","oi","pr","total"]}
    pct_gaps = {p: round((gaps[p] / bench[p]) * 100, 1) for p in ["tlr","rpc","go","oi","pr","total"]}
    return {"institution": institution, "benchmark": bench, "your_scores": MY_SCORES, "gaps": gaps, "percentage_gaps": pct_gaps, "rank_gap": MY_SCORES["rank"] - bench["rank"]}


@router.get("/all")
async def get_all_benchmarks():
    result = []
    for name, scores in BENCHMARK_DATA.items():
        gaps = {p: round(MY_SCORES[p] - scores[p], 2) for p in ["tlr","rpc","go","oi","pr","total"]}
        result.append({"institution": name, **scores, "gaps": gaps})
    return {"benchmarks": result, "your_scores": MY_SCORES}

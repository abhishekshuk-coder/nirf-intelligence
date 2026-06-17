from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import os

router = APIRouter()

SYSTEM_PROMPT = """You are an expert NIRF (National Institutional Ranking Framework) analytics AI assistant.
You have access to the institution's NIRF data, historical scores, benchmark comparisons, and gap analysis.

Key institutional data:
- Current NIRF Score: 74.5 / 100
- Current Rank: #47 (improved from #61)
- TLR: 22.1/30, RPC: 21.5/30, GO: 16.2/20, OI: 7.3/10, PR: 7.4/10
- Total Faculty: 297 (PhD: 198), Students: 3560
- Publications: 1248, Citations: 8942, H-Index: 42
- Patents: 34, Placement Rate: 88.4%
- Benchmark: IIT Madras (Rank #1, Score: 94.5)

Always provide:
1. Data-driven insights based on the institution's actual numbers
2. Specific, actionable recommendations
3. Impact estimates for each recommendation
4. References to relevant NIRF parameters

Be concise, strategic, and executive-focused."""


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class CopilotRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    institution_id: Optional[str] = None


class CopilotResponse(BaseModel):
    response: str
    sources: List[str]
    parameter_tags: List[str]
    confidence: float


def generate_local_response(question: str) -> CopilotResponse:
    """Fallback response when AI API is not configured."""
    q = question.lower()

    if any(w in q for w in ["rank", "ranking", "position"]):
        return CopilotResponse(
            response="Your current NIRF rank is **#47** with a score of **74.5/100**. You've improved by 14 positions since 2022 (#61). The primary driver of improvement has been research output (RPC increased from 19.4 to 21.5). To reach Top 30, you need a score of approximately 81+, which requires primarily improving RPC (+4.5 pts) and TLR (+4.9 pts).",
            sources=["Historical NIRF Data", "Prediction Engine"],
            parameter_tags=["RPC", "TLR", "Overall"],
            confidence=0.92,
        )

    if any(w in q for w in ["research", "publication", "paper", "rpc"]):
        return CopilotResponse(
            response="Your RPC score is **21.5/30** — this is your **biggest improvement opportunity** (7.3 pts below target).\n\n**Critical Actions:**\n1. Push 80+ pending papers for Scopus indexing this quarter (+2.1 pts)\n2. File 6 new patents before March 2025 (+1.2 pts)\n3. Increase consultancy to ₹6 Cr (+0.8 pts)\n4. Target 10,000 citations by Dec 2025 (+0.6 pts)\n\nClosing the RPC gap alone could move you from Rank #47 to approximately Rank #35.",
            sources=["RPC Analysis", "Gap Analysis Engine", "Benchmark Data"],
            parameter_tags=["RPC"],
            confidence=0.94,
        )

    if any(w in q for w in ["faculty", "teacher", "tlr", "teaching"]):
        return CopilotResponse(
            response="Your TLR score is **22.1/30**. Key gaps:\n- **PhD Faculty**: 66.7% vs target 75% → hire 25 more PhD faculty\n- **Student-Faculty Ratio**: 11.98:1 (good, target ≤15:1)\n- **Financial Resources**: ₹18 Cr — increase lab/library allocation\n\nBudget ₹8 Cr for faculty recruitment this year to close the PhD ratio gap.",
            sources=["TLR Data", "Faculty Analytics"],
            parameter_tags=["TLR"],
            confidence=0.90,
        )

    if any(w in q for w in ["placement", "go", "graduation", "salary"]):
        return CopilotResponse(
            response="Your GO score is **16.2/20** — this is actually your **best performing area** (81% of maximum).\n\n**Current Performance:**\n- Overall outcome rate: 88.4% (placed + higher studies + self-employed)\n- Median salary: ₹6.8 Lakh (target: ₹7 Lakh+)\n\n**To improve to 18.5+:**\n1. Target top-50 companies for campus recruitment\n2. Launch pre-placement training program\n3. Increase median salary to ₹7.2 Lakh through better placements",
            sources=["GO Analysis", "Placement Cell Data"],
            parameter_tags=["GO"],
            confidence=0.91,
        )

    # Default comprehensive response
    return CopilotResponse(
        response="Based on your institutional data analysis:\n\n**Current Status:** Rank #47, Score 74.5/100\n\n**Priority Actions:**\n1. 🔴 **RPC** (Critical): Push publications, file patents — potential +7.3 pts\n2. 🟡 **TLR** (Moderate): Hire PhD faculty — potential +4.9 pts\n3. 🟡 **PR** (Moderate): Build academic reputation — potential +2.5 pts\n\n**3-Year Target:** Rank #22, Score 84+ with full implementation\n\nWould you like a detailed action plan for any specific parameter?",
        sources=["NIRF Dashboard Data", "Gap Analysis", "Benchmark Analysis"],
        parameter_tags=["TLR", "RPC", "GO", "OI", "PR"],
        confidence=0.88,
    )


@router.post("/chat", response_model=CopilotResponse)
async def chat(req: CopilotRequest):
    api_key = os.getenv("OPENAI_API_KEY") or os.getenv("GEMINI_API_KEY")

    if api_key and api_key.startswith("sk-"):
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=api_key)
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            for h in (req.history or []):
                messages.append({"role": h.role, "content": h.content})
            messages.append({"role": "user", "content": req.message})

            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                max_tokens=800,
                temperature=0.7,
            )
            return CopilotResponse(
                response=response.choices[0].message.content,
                sources=["Institutional Data", "NIRF Framework", "AI Analysis"],
                parameter_tags=["TLR", "RPC", "GO", "OI", "PR"],
                confidence=0.95,
            )
        except Exception:
            pass

    # Fallback to local responses
    return generate_local_response(req.message)

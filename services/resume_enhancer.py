from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field

from config import settings
from models import ResumeEnhanceRequest, ResumeEnhanceResponse


class LLMEnhanceResult(BaseModel):
    enhanced_content: str = Field(description="The rewritten high-impact ATS-optimized text.")
    ats_score: int = Field(ge=70, le=100, description="Estimated ATS compatibility score.")
    improvements: list[str] = Field(description="Key additions made (metrics, keywords, action verbs).")


def enhance_resume_content(request: ResumeEnhanceRequest) -> ResumeEnhanceResponse:
    if not settings.google_api_key:
        raise RuntimeError("GOOGLE_API_KEY is not configured.")

    prompt = f"""You are a top executive tech recruiter and resume optimization expert.
Rewrite and elevate the following resume {request.section} for a '{request.target_role}' candidate.

Guidelines:
1. Use strong executive action verbs (e.g. Architected, Spearheaded, Engineered, Orchestrated, Optimized).
2. Quantify results with realistic high-impact metrics (latency reduction, cost savings, scale, 99.999% SLA, throughput).
3. Maximize ATS keyword density for distributed systems, cloud infrastructure, or the specified role.
4. Keep the output punchy, professional, and directly drop-in ready.

ORIGINAL CONTENT:
{request.content}
"""

    llm = ChatGoogleGenerativeAI(
        model=settings.gemini_model,
        google_api_key=settings.google_api_key,
        temperature=0.2,
    ).with_structured_output(LLMEnhanceResult)

    res: LLMEnhanceResult = llm.invoke(prompt)

    return ResumeEnhanceResponse(
        original=request.content,
        enhanced=res.enhanced_content,
        ats_score_estimate=res.ats_score,
        improvements=res.improvements
    )

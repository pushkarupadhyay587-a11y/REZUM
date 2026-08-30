from pydantic import BaseModel, Field


class ResumeScore(BaseModel):
    filename: str
    rank: int = Field(ge=1)
    score: float = Field(ge=0, le=100)
    recommendation: str
    strengths: list[str]
    gaps: list[str]
    suggested_skills: list[str]
    improvement_suggestions: list[str]
    summary: str


class RankingResponse(BaseModel):
    role: str
    ranked_resumes: list[ResumeScore]
    overall_notes: list[str]
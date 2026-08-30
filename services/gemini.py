from langchain_google_genai import ChatGoogleGenerativeAI

from config import settings
from models import RankingResponse


def rank_resumes(role: str, resumes: list[dict[str, str]]) -> RankingResponse:
    if not settings.google_api_key:
        raise RuntimeError("GOOGLE_API_KEY is missing from the environment")

    prompt = _build_prompt(role, resumes)
    try:
        model = ChatGoogleGenerativeAI(
            model=settings.gemini_model,
            google_api_key=settings.google_api_key,
            temperature=0,
        ).with_structured_output(RankingResponse)
        return model.invoke(prompt)
    except Exception as error:
        raise RuntimeError(f"Gemini ranking failed: {error}") from error


def _build_prompt(role: str, resumes: list[dict[str, str]]) -> str:
    resume_text = "\n\n".join(
        f"RESUME {index}: {resume['filename']}\n{resume['text'][:settings.max_resume_chars]}"
        for index, resume in enumerate(resumes, start=1)
    )
    return f"""You are an expert technical recruiter. Rank the supplied resumes only against the provided role.
Do not infer protected characteristics or use them in scoring. Focus on skills, experience, education,
relevant achievements, and evidence of fit. Return a structured response matching the RankingResponse schema.
For each resume, suggest practical skills to add based on role requirements and identify concrete resume
improvements. Only suggest skills that are relevant to the role and not already demonstrated in the resume.

ROLE:
{role}

{resume_text}

Rank every resume exactly once, use the original filename, assign ranks from 1, and provide concise evidence-based notes."""
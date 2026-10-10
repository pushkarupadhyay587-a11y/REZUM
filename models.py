from pydantic import BaseModel, Field
from typing import Optional


# --- Resume Ranking Models ---
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


# --- Authentication Models ---
class UserRegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=6, max_length=128)
    role_title: Optional[str] = "Software Engineer // Distributed Systems"


class UserLoginRequest(BaseModel):
    email: str
    password: str


class GoogleAuthRequest(BaseModel):
    credential: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None
    picture: Optional[str] = None
    sub: Optional[str] = None


class UserProfile(BaseModel):
    id: int
    name: str
    email: str
    role_title: str
    location: str
    avatar_url: Optional[str] = None
    provider: str = "local"
    target_roles: Optional[str] = None
    salary_min: Optional[str] = None


class AuthResponse(BaseModel):
    token: str
    user: UserProfile
    message: str = "Authenticated successfully"


class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    role_title: Optional[str] = None
    location: Optional[str] = None
    target_roles: Optional[str] = None
    salary_min: Optional[str] = None


# --- Jobs Models ---
class JobItem(BaseModel):
    id: str
    title: str
    company: str
    loc: str
    desc: str
    pay: str
    tags: list[str]
    match: int
    source: str
    category: str
    linkedin_url: str
    indeed_url: str
    glassdoor_url: str
    posted_at: Optional[str] = "Just now"


class JobsResponse(BaseModel):
    jobs: list[JobItem]
    total: int
    generated_by: str = "system"


class GenerateJobsRequest(BaseModel):
    query: Optional[str] = "Staff Software Engineer, Machine Learning, Cloud Platform, Distributed Systems"
    count: Optional[int] = 8


# --- Roadmap Models ---
class RoadmapResource(BaseModel):
    id: str
    stepNum: str
    type: str  # REPO, DOCS, COURSE, RFC, BOOK
    title: str
    duration: str
    hours: int
    completed: bool = False
    url: str
    repo_name: Optional[str] = None
    description: Optional[str] = None


class RoadmapStep(BaseModel):
    num: str
    title: str
    duration: str
    status: str = "pending"
    resources: list[RoadmapResource]


class RoadmapPathway(BaseModel):
    id: str
    title: str
    target_role: str
    description: str
    github_source: str
    github_url: str
    est_weeks: int
    skill_gaps: list[dict[str, str]]
    steps: list[RoadmapStep]


class RoadmapProgressRequest(BaseModel):
    pathway_id: str
    resource_id: str
    completed: bool


# --- Resume Enhancement Models ---
class ResumeEnhanceRequest(BaseModel):
    section: str  # "summary" or "experience"
    content: str
    target_role: Optional[str] = "Senior / Staff Software Engineer"


class ResumeEnhanceResponse(BaseModel):
    original: str
    enhanced: str
    ats_score_estimate: int
    improvements: list[str]
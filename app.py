import os
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, File, Form, Header, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from models import (
    AuthResponse,
    GenerateJobsRequest,
    GoogleAuthRequest,
    JobsResponse,
    ProfileUpdateRequest,
    RankingResponse,
    ResumeEnhanceRequest,
    ResumeEnhanceResponse,
    RoadmapPathway,
    RoadmapProgressRequest,
    UserLoginRequest,
    UserProfile,
    UserRegisterRequest,
)
from services.auth_service import (
    get_user_by_id,
    google_login_or_register,
    login_user,
    register_user,
    update_profile,
    verify_token,
)
from services.gemini import rank_resumes
from services.job_service import generate_jobs_with_llm, get_all_jobs
from services.resume_enhancer import enhance_resume_content
from services.resume_parser import extract_resume_text
from services.roadmap_service import (
    get_all_pathways,
    get_pathway_by_id,
    toggle_resource_progress,
)

app = FastAPI(
    title="REZUM Career Intelligence API",
    description="Full-stack API for resume ranking, career roadmaps, real-time job indexing, and AI career acceleration.",
    version="2.0.0",
)

# CORS setup for flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
app.mount("/static", StaticFiles(directory="static"), name="static")


# --- Auth Dependency Helper ---
def _extract_user_id(authorization: Optional[str]) -> Optional[int]:
    if not authorization:
        return None
    token = authorization.replace("Bearer ", "").strip()
    payload = verify_token(token)
    return payload.get("uid") if payload else None


@app.get("/", include_in_schema=False)
def home() -> FileResponse:
    return FileResponse("static/index.html")


@app.get("/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "ok", "system": "REZUM Career Intelligence v2"}


@app.get("/api/config", tags=["system"])
def app_config() -> dict[str, object]:
    client_id = os.getenv("GOOGLE_CLIENT_ID", "").strip()
    return {
        "app_name": "REZUM",
        "google_client_id": client_id,
        "google_enabled": bool(client_id),
        "jobs_enabled": True,
        "roadmaps_enabled": True,
    }


# ================================================================
#  AUTHENTICATION & USER PROFILE APIS
# ================================================================
@app.post("/api/auth/register", response_model=AuthResponse, tags=["auth"])
def register(req: UserRegisterRequest) -> AuthResponse:
    try:
        token, profile = register_user(
            name=req.name,
            email=req.email,
            password=req.password,
            role_title=req.role_title or "Staff Software Engineer"
        )
        return AuthResponse(token=token, user=profile, message="Account created successfully")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/auth/login", response_model=AuthResponse, tags=["auth"])
def login(req: UserLoginRequest) -> AuthResponse:
    try:
        token, profile = login_user(email=req.email, password=req.password)
        return AuthResponse(token=token, user=profile, message="Signed in successfully")
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


@app.post("/api/auth/google", response_model=AuthResponse, tags=["auth"])
def google_auth(req: GoogleAuthRequest) -> AuthResponse:
    try:
        token, profile = google_login_or_register(
            credential=req.credential,
            email=req.email,
            name=req.name,
            picture=req.picture,
            sub=req.sub
        )
        return AuthResponse(token=token, user=profile, message="Google identity verified successfully")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/auth/me", response_model=UserProfile, tags=["auth"])
def get_me(authorization: Optional[str] = Header(None)) -> UserProfile:
    uid = _extract_user_id(authorization)
    if not uid:
        raise HTTPException(status_code=401, detail="Authentication token required or expired")
    user = get_user_by_id(uid)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.put("/api/auth/profile", response_model=UserProfile, tags=["auth"])
def update_user_settings(req: ProfileUpdateRequest, authorization: Optional[str] = Header(None)) -> UserProfile:
    uid = _extract_user_id(authorization)
    if not uid:
        raise HTTPException(status_code=401, detail="Authentication required")
    try:
        return update_profile(uid, req.model_dump(exclude_unset=True))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/auth/logout", tags=["auth"])
def logout():
    return {"status": "ok", "message": "Logged out successfully"}


# ================================================================
#  JOBS INDEX & AI-POWERED LABOR REFRESH
# ================================================================
@app.get("/api/jobs", response_model=JobsResponse, tags=["jobs"])
def list_jobs(
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = None
) -> JobsResponse:
    jobs = get_all_jobs(category=category, search=search, sort_by=sort_by)
    return JobsResponse(jobs=jobs, total=len(jobs), generated_by="database")


@app.post("/api/jobs/refresh", response_model=JobsResponse, tags=["jobs"])
async def refresh_jobs_with_llm(req: Optional[GenerateJobsRequest] = None) -> JobsResponse:
    query = req.query if req and req.query else "Staff Software Engineer, Machine Learning, Cloud Platform, Distributed Systems"
    count = req.count if req and req.count else 8
    try:
        new_jobs = await run_in_threadpool(generate_jobs_with_llm, query, count)
        return JobsResponse(jobs=new_jobs, total=len(new_jobs), generated_by="gemini-llm")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LLM Job Generation failed: {e}")


# ================================================================
#  GITHUB LEARNING ROADMAPS & OPEN SOURCE RESOURCES
# ================================================================
@app.get("/api/roadmaps", response_model=list[RoadmapPathway], tags=["roadmaps"])
def list_roadmaps() -> list[RoadmapPathway]:
    return get_all_pathways()


@app.get("/api/roadmaps/{pathway_id}", response_model=RoadmapPathway, tags=["roadmaps"])
def get_roadmap(pathway_id: str, authorization: Optional[str] = Header(None)) -> RoadmapPathway:
    uid = _extract_user_id(authorization)
    pathway = get_pathway_by_id(pathway_id, user_id=uid)
    if not pathway:
        raise HTTPException(status_code=404, detail=f"Pathway {pathway_id} not found")
    return pathway


@app.post("/api/roadmaps/progress", tags=["roadmaps"])
def update_roadmap_progress(
    req: RoadmapProgressRequest,
    authorization: Optional[str] = Header(None)
):
    uid = _extract_user_id(authorization)
    if not uid:
        # Fallback to demo user 1 if not logged in so UI works smoothly
        uid = 1
    toggle_resource_progress(uid, req.pathway_id, req.resource_id, req.completed)
    return {"status": "ok", "completed": req.completed}


# ================================================================
#  AI RESUME ENHANCEMENT
# ================================================================
@app.post("/api/resume/ai-enhance", response_model=ResumeEnhanceResponse, tags=["resume"])
async def ai_enhance_resume(req: ResumeEnhanceRequest) -> ResumeEnhanceResponse:
    if not req.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty")
    try:
        return await run_in_threadpool(enhance_resume_content, req)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini resume enhancement failed: {e}")


# ================================================================
#  RESUME RANKING & AUDITING APIS
# ================================================================
@app.post("/upload", response_model=RankingResponse, tags=["ranking"])
async def upload_and_rank(
    role: str = Form(..., description="The job role or job description to rank against."),
    file: UploadFile = File(..., description="A PDF, DOCX, or TXT resume file."),
) -> RankingResponse:
    filename = file.filename or "resume"
    content = await file.read()
    try:
        text = extract_resume_text(filename, content)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not text.strip():
        raise HTTPException(status_code=400, detail=f"No readable text found in {filename}")
    UPLOAD_DIR.mkdir(exist_ok=True)
    (UPLOAD_DIR / Path(filename).name).write_bytes(content)
    await file.seek(0)
    return await rank(role, [file])


@app.post("/rank", response_model=RankingResponse, tags=["ranking"])
async def rank(
    role: str = Form(..., description="The job role or job description to rank against."),
    files: list[UploadFile] = File(..., description="PDF, DOCX, or TXT resume files."),
) -> RankingResponse:
    if not role.strip():
        raise HTTPException(status_code=400, detail="role must not be empty")
    if not files:
        raise HTTPException(status_code=400, detail="at least one resume is required")

    resumes = []
    for upload in files:
        filename = upload.filename or "resume"
        content = await upload.read()
        try:
            text = extract_resume_text(filename, content)
        except ValueError as error:
            raise HTTPException(status_code=400, detail=str(error)) from error
        if not text.strip():
            raise HTTPException(status_code=400, detail=f"No readable text found in {filename}")
        resumes.append({"filename": filename, "text": text})

    try:
        result = await run_in_threadpool(rank_resumes, role.strip(), resumes)
    except RuntimeError as error:
        raise HTTPException(status_code=502, detail=str(error)) from error

    return result
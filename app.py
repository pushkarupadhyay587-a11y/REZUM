from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from fastapi.concurrency import run_in_threadpool
from pathlib import Path

from models import RankingResponse
from services.gemini import rank_resumes
from services.resume_parser import extract_resume_text


app = FastAPI(
    title="Rezum Resume Ranking API",
    description="Ranks resumes against a provided job role using Gemini.",
    version="1.0.0",
)
UPLOAD_DIR = Path("uploads")


@app.get("/", include_in_schema=False)
def home() -> FileResponse:
    return FileResponse("static/index.html")


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}


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
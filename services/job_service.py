import json
import sqlite3
import urllib.parse
from typing import Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel

from config import settings
from models import JobItem

DB_PATH = "rezum.db"


def build_job_links(title: str, company: str, location: str) -> tuple[str, str, str]:
    query = f"{title} {company}".strip()
    loc = location.split("//")[0].strip() if location else ""
    
    linkedin_params = {"keywords": query}
    if loc and "remote" not in loc.lower():
        linkedin_params["location"] = loc
    linkedin_url = f"https://www.linkedin.com/jobs/search/?{urllib.parse.urlencode(linkedin_params)}"

    indeed_params = {"q": query}
    if loc:
        indeed_params["l"] = loc
    indeed_url = f"https://www.indeed.com/jobs?{urllib.parse.urlencode(indeed_params)}"

    glassdoor_params = {"sc.keyword": f"{title} {company}"}
    glassdoor_url = f"https://www.glassdoor.com/Job/jobs.htm?{urllib.parse.urlencode(glassdoor_params)}"

    return linkedin_url, indeed_url, glassdoor_url


INITIAL_JOBS: list[dict] = [
    {
        "id": "job-1",
        "loc": "SAN FRANCISCO, CA // HYBRID",
        "title": "Staff Platform Architect",
        "company": "Stripe",
        "desc": "Lead foundational distributed transaction mesh and high-throughput low-latency payment infrastructure handling 100K+ writes/sec.",
        "pay": "$280K - $360K",
        "tags": ["DISTRIBUTED SYSTEMS", "KAFKA", "GO", "KUBERNETES"],
        "match": 95,
        "source": "STRIPE CAREERS",
        "category": "INFRASTRUCTURE",
    },
    {
        "id": "job-2",
        "loc": "SAN FRANCISCO, CA // HYBRID",
        "title": "Head of AI Architecture",
        "company": "Anthropic",
        "desc": "Direct large-scale transformer inference optimization and model serving pipelines across multi-tenant GPU superclusters.",
        "pay": "$350K - $450K",
        "tags": ["PYTORCH", "CUDA", "LLM INFERENCE", "TRITON"],
        "match": 93,
        "source": "GREENHOUSE",
        "category": "AI / ML",
    },
    {
        "id": "job-3",
        "loc": "NEW YORK, NY // REMOTE",
        "title": "Principal Reliability Engineer",
        "company": "Cloudflare",
        "desc": "Architect global edge routing resilience and 99.999% SLA across 330+ city Points of Presence.",
        "pay": "$270K - $340K",
        "tags": ["SRE", "EBPF", "RUST", "BGP / NETWORKING"],
        "match": 89,
        "source": "LEVER",
        "category": "REMOTE",
    },
    {
        "id": "job-4",
        "loc": "SEATTLE, WA // REMOTE",
        "title": "Staff Backend Engineer",
        "company": "Datadog",
        "desc": "Scale real-time telemetry indexing engine ingesting trillions of metric events daily with sub-second query latency.",
        "pay": "$260K - $330K",
        "tags": ["GO", "TIME-SERIES", "APACHE ARROW", "DISTRIBUTED CACHE"],
        "match": 87,
        "source": "DATADOG JOBS",
        "category": "INFRASTRUCTURE",
    },
    {
        "id": "job-5",
        "loc": "REMOTE // US & CANADA",
        "title": "Senior ML Platform Engineer",
        "company": "Scale AI",
        "desc": "Design end-to-end RLHF workflows, automated evals, and distributed training pipelines for frontier AI applications.",
        "pay": "$240K - $310K",
        "tags": ["RAY", "KUBERNETES", "MLFLOW", "PYTHON"],
        "match": 85,
        "source": "ASHBY",
        "category": "AI / ML",
    },
    {
        "id": "job-6",
        "loc": "AUSTIN, TX // HYBRID",
        "title": "Principal Security Architect",
        "company": "CrowdStrike",
        "desc": "Lead Zero Trust endpoint telemetry and kernel-level threat detection architecture across heterogeneous OS platforms.",
        "pay": "$280K - $350K",
        "tags": ["SECURITY", "ZERO TRUST", "KERNEL", "C++"],
        "match": 82,
        "source": "GREENHOUSE",
        "category": "HYBRID",
    },
    {
        "id": "job-7",
        "loc": "REMOTE // GLOBAL",
        "title": "VP of Engineering, Core Services",
        "company": "Vercel",
        "desc": "Steer a 50+ person engineering organization responsible for global edge functions, serverless runtimes, and build pipelines.",
        "pay": "$320K - $420K",
        "tags": ["SYSTEMS LEADERSHIP", "RUST", "SERVERLESS", "EDGE COMPUTING"],
        "match": 80,
        "source": "VERCEL CAREERS",
        "category": "LEADERSHIP",
    },
    {
        "id": "job-8",
        "loc": "BOSTON, MA // HYBRID",
        "title": "Staff Full Stack Systems Architect",
        "company": "Figma",
        "desc": "Build next-generation collaborative multiplayer canvas engines leveraging WebAssembly, WebGL, and CRDT synchronization.",
        "pay": "$260K - $325K",
        "tags": ["WASM", "TYPESCRIPT", "CRDT", "GRAPHICS"],
        "match": 78,
        "source": "LEVER",
        "category": "HYBRID",
    }
]


def init_jobs_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS job_postings (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            company TEXT NOT NULL,
            loc TEXT NOT NULL,
            desc TEXT NOT NULL,
            pay TEXT NOT NULL,
            tags TEXT NOT NULL,
            match INTEGER NOT NULL,
            source TEXT NOT NULL,
            category TEXT NOT NULL,
            linkedin_url TEXT NOT NULL,
            indeed_url TEXT NOT NULL,
            glassdoor_url TEXT NOT NULL,
            posted_at TEXT DEFAULT 'Just now'
        )
    """)
    conn.commit()

    # Seed if empty
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM job_postings")
    count = cursor.fetchone()[0]
    if count == 0:
        for job in INITIAL_JOBS:
            l_url, i_url, g_url = build_job_links(job["title"], job["company"], job["loc"])
            cursor.execute("""
                INSERT INTO job_postings (id, title, company, loc, desc, pay, tags, match, source, category, linkedin_url, indeed_url, glassdoor_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                job["id"], job["title"], job["company"], job["loc"], job["desc"],
                job["pay"], json.dumps(job["tags"]), job["match"], job["source"],
                job["category"], l_url, i_url, g_url
            ))
        conn.commit()
    conn.close()


def get_all_jobs(category: Optional[str] = None, search: Optional[str] = None, sort_by: Optional[str] = None) -> list[JobItem]:
    init_jobs_db()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    query = "SELECT * FROM job_postings WHERE 1=1"
    params = []
    
    if category and category.upper() != "ALL":
        query += " AND category = ?"
        params.append(category.upper())
    
    if search and search.strip():
        term = f"%{search.strip()}%"
        query += " AND (title LIKE ? OR company LIKE ? OR tags LIKE ? OR desc LIKE ?)"
        params.extend([term, term, term, term])
    
    if sort_by == "match-desc":
        query += " ORDER BY match DESC"
    elif sort_by == "salary-desc":
        query += " ORDER BY pay DESC"
    else:
        query += " ORDER BY match DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    items = []
    for r in rows:
        tags = json.loads(r["tags"]) if isinstance(r["tags"], str) else r["tags"]
        items.append(JobItem(
            id=r["id"],
            title=r["title"],
            company=r["company"],
            loc=r["loc"],
            desc=r["desc"],
            pay=r["pay"],
            tags=tags,
            match=r["match"],
            source=r["source"],
            category=r["category"],
            linkedin_url=r["linkedin_url"],
            indeed_url=r["indeed_url"],
            glassdoor_url=r["glassdoor_url"],
            posted_at=r["posted_at"]
        ))
    return items


# Pydantic schema for Gemini structured output
class LLMJobCard(BaseModel):
    title: str
    company: str
    location: str
    description: str
    pay_range: str
    skills: list[str]
    match_score: int
    category: str  # INFRASTRUCTURE, AI / ML, REMOTE, HYBRID, LEADERSHIP
    source: str


class LLMJobsList(BaseModel):
    jobs: list[LLMJobCard]


def generate_jobs_with_llm(prompt_query: str = "Staff Software Engineer, Distributed Systems, AI Platform", count: int = 8) -> list[JobItem]:
    if not settings.google_api_key:
        raise RuntimeError("GOOGLE_API_KEY is not set.")

    sys_prompt = f"""You are a specialized technical recruiting intelligence system.
Generate {count} ultra-realistic, current, high-demand job openings in the tech market matching criteria: '{prompt_query}'.
Include real top-tier tech firms (e.g. OpenAI, Stripe, Datadog, Anthropic, Cloudflare, Meta, Google, Uber, Snowflake, Vercel, Figma).
Provide realistic high-tech descriptions, accurate base + equity pay ranges ($180K-$450K), 3-5 tech stack tags, and category in [INFRASTRUCTURE, AI / ML, REMOTE, HYBRID, LEADERSHIP].
Match scores should range between 75 and 96."""

    llm = ChatGoogleGenerativeAI(
        model=settings.gemini_model,
        google_api_key=settings.google_api_key,
        temperature=0.7
    ).with_structured_output(LLMJobsList)

    result: LLMJobsList = llm.invoke(sys_prompt)
    if not result or not result.jobs:
        raise RuntimeError("Failed to generate jobs with LLM")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    new_jobs = []

    for i, j in enumerate(result.jobs, start=1):
        job_id = f"ai-job-{int(urllib.parse.quote(j.company[:4]).encode().hex()[:6], 16) % 100000}-{i}"
        l_url, ind_url, g_url = build_job_links(j.title, j.company, j.location)
        
        cursor.execute("""
            INSERT OR REPLACE INTO job_postings 
            (id, title, company, loc, desc, pay, tags, match, source, category, linkedin_url, indeed_url, glassdoor_url, posted_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'AI Synced')
        """, (
            job_id, j.title, j.company, j.location.upper(), j.description,
            j.pay_range, json.dumps(j.skills), j.match_score, j.source.upper(),
            j.category.upper(), l_url, ind_url, g_url
        ))
        
        new_jobs.append(JobItem(
            id=job_id,
            title=j.title,
            company=j.company,
            loc=j.location.upper(),
            desc=j.description,
            pay=j.pay_range,
            tags=j.skills,
            match=j.match_score,
            source=j.source.upper(),
            category=j.category.upper(),
            linkedin_url=l_url,
            indeed_url=ind_url,
            glassdoor_url=g_url,
            posted_at="AI Synced"
        ))

    conn.commit()
    conn.close()
    return new_jobs


init_jobs_db()

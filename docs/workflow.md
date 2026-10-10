# CareerForge: End-to-End Workflow

Working name: **CareerForge** (rename freely). A Python web app that takes a user from "I have a resume" to "I applied to the right jobs and know what to learn next."

## 1. High-Level User Journey

```
Sign up / Login
      |
      v
Upload resume (PDF/DOCX) or build from scratch
      |
      v
Parse -> structured profile (JSON Resume schema)
      |
      v
Resume Editor (live preview, templates, ATS-safe export)
      |
      v
AI Analysis & Rating (0-100 score + category breakdown + fixes)
      |
      +--> One-click "Apply suggestion" -> back to editor
      |
      v
Set career goals (target role, location, salary, remote)
      |
      v
Job Matching Engine (fetch jobs -> embed -> rank vs resume)
      |
      v
Top-N job list with match %, missing skills, reasons
      |
      +--> Tailor resume + cover letter for a job
      +--> Apply (assisted apply -> track in dashboard)
      |
      v
Skill Gap Analysis (job requirements vs profile)
      |
      v
Learning Hub: roadmap generation + curated resource links
      |
      v
Progress tracking -> re-score resume -> re-match jobs (loop)
```

## 2. Detailed Pipelines

### 2.1 Resume Ingestion
1. User uploads PDF/DOCX (max 5 MB) or starts from a template.
2. Server validates MIME type + magic bytes, scans for malware, stores in object storage (encrypted).
3. Text extraction: `pdfplumber` / `PyMuPDF` for PDF, `python-docx` for DOCX. OCR fallback (`pytesseract`) for scanned files.
4. LLM structured-extraction call converts raw text to JSON Resume schema (basics, work, education, skills, projects, certifications).
5. User reviews parsed result and corrects errors (human-in-the-loop).

### 2.2 Resume Customization
1. Section-based editor (add, remove, reorder, toggle visibility).
2. Template gallery (ATS-safe single column default).
3. AI assist actions per section: "Rewrite bullet with impact", "Add metrics", "Shorten", "Match tone".
4. Export: PDF (WeasyPrint), DOCX (python-docx), plain-text ATS version.
5. Versioning: each save creates a version; users can maintain multiple "role-specific" variants.

### 2.3 AI Analysis and Rating
Inputs: structured resume, optional target role / job description.

Scoring rubric (weights configurable):
| Category | Weight | What is checked |
|---|---|---|
| ATS compatibility | 25% | Parsable structure, standard headings, no tables/images, keyword presence |
| Content impact | 25% | Action verbs, quantified achievements, relevance |
| Skills match | 20% | Coverage vs target role / JD |
| Structure & clarity | 15% | Length, ordering, consistency, gaps |
| Language quality | 10% | Grammar, tense, tone, passive voice |
| Completeness | 5% | Contact info, links, summary |

Process:
1. Deterministic checks (rule engine): length, section presence, date formatting, contact info, bullet length.
2. LLM evaluation with a strict JSON schema output (scores, strengths, issues, suggested rewrites).
3. Keyword/semantic match against target JD using embeddings (cosine similarity) plus keyword overlap.
4. Aggregate to the final score; store the report; show diffs between versions over time.

### 2.4 Job Discovery and Ranking
1. Sources (legal APIs only): Adzuna, Remotive, Jooble, JSearch (RapidAPI), The Muse, company ATS public boards (Greenhouse, Lever, Ashby).
2. Background worker normalizes jobs to a common schema and de-duplicates (hash of company+title+location).
3. Embeddings for each job and for the resume profile are stored in `pgvector`.
4. Ranking = weighted blend: semantic similarity (50%), skill overlap (25%), seniority/experience fit (10%), location/remote/salary preference (10%), freshness (5%).
5. Explanations: LLM generates "why it matches" and "what you're missing" (cached).

### 2.5 Applying
- **Assisted apply (default, MVP):** generate tailored resume + cover letter, open the official apply URL, user submits, then marks as applied (or pastes confirmation email).
- **Auto-apply (later phase, opt-in):** only for ATS boards that publish application APIs (Greenhouse/Lever) and with explicit per-application user confirmation. No scraping of LinkedIn/Indeed (violates their ToS).
- Application tracker: Saved, Applied, Interview, Offer, Rejected with notes and reminders.

### 2.6 Skill Gap, Roadmaps, and Resources
1. Aggregate required skills from the top-N matched jobs, count frequency, subtract user skills, giving a ranked gap list.
2. Roadmap generator: LLM produces a staged plan (Foundations, Core, Projects, Interview prep) with time estimates, grounded in curated roadmap data (roadmap.sh-style topic graphs stored in DB).
3. Resource linking: for each topic, retrieve links from (a) a curated, human-verified resource table, (b) YouTube Data API, (c) web search API. Links are validated (HTTP 200) and ranked by quality signals. The LLM never invents URLs; it only selects from retrieved candidates.
4. Progress tracking: checkboxes per topic, streaks, optional quizzes; completed skills feed back into the resume as suggested additions.

### 2.7 Feedback Loop
Completed learning, new projects, and applications update the profile, which triggers a re-score and a re-rank of jobs (weekly digest email optional).

## 3. System Flow (Async Processing)

```
Browser -> FastAPI -> PostgreSQL (state)
                 |-> Redis queue -> Celery workers:
                        - parse_resume
                        - analyze_resume
                        - fetch_jobs (scheduled)
                        - embed_and_rank
                        - generate_roadmap
                 |-> Object storage (resume files)
                 |-> LLM provider API (Claude) + embeddings
```
Long tasks return a `task_id`; the UI polls or uses Server-Sent Events for status.

## 4. Key Screens
1. Landing / Auth
2. Onboarding (upload resume, set goals)
3. Resume Editor + Live Preview
4. Analysis Report (score ring, category bars, fix list)
5. Job Board (filters, match %, save/apply)
6. Job Detail (match explanation, tailor, apply)
7. Application Tracker (kanban)
8. Learning Hub (gap list, roadmap view, resource cards, progress)
9. Settings (privacy, data export/delete, connected accounts)

# Technical Requirements Document (TRD)

**Product:** CareerForge
**Version:** 1.0 (draft)
**Language:** Python 3.12

## 1. Architecture Summary
A modular monolith (FastAPI) with background workers, designed so modules (resume, analysis, jobs, learning) can be split into services later.

```
[Browser: Jinja2 + HTMX + Tailwind]  (or React SPA later)
            |
        [Nginx / Caddy]
            |
        [FastAPI app] ---- [Redis] ---- [Celery workers + beat]
            |                                  |
     [PostgreSQL + pgvector]            [LLM API / Embeddings]
            |                                  |
     [Object storage S3/MinIO]         [Job APIs / YouTube / Search API]
```

## 2. Technology Stack
| Layer | Choice | Notes |
|---|---|---|
| Web framework | FastAPI + Uvicorn/Gunicorn | Async, OpenAPI docs |
| Frontend (MVP) | Jinja2 + HTMX + Tailwind + Alpine.js | Python-centric, fast to ship |
| Frontend (alt) | Streamlit for prototype only | Not for production |
| DB | PostgreSQL 16 + pgvector | Relational + vector search |
| ORM / migrations | SQLAlchemy 2.0 + Alembic | |
| Validation | Pydantic v2 | Also for LLM output schemas |
| Queue | Celery + Redis | Beat for scheduled job fetch |
| Auth | FastAPI-Users or Authlib (OAuth2/OIDC) + JWT/session cookies | Argon2 hashing |
| File storage | S3-compatible (AWS S3 / MinIO) | Encrypted at rest |
| PDF parsing | PyMuPDF, pdfplumber; pytesseract OCR fallback | |
| DOCX | python-docx | |
| PDF export | WeasyPrint (HTML/CSS to PDF) | |
| LLM | Anthropic Claude API (provider-abstracted) | Structured outputs via tool/JSON schema |
| Embeddings | Provider embedding API or `sentence-transformers` (local, e.g. all-MiniLM / bge) | Configurable |
| NLP utils | spaCy, rapidfuzz, a skills taxonomy (ESCO / O*NET) | Skill normalization |
| HTTP client | httpx (async) with retries (tenacity) | |
| Caching | Redis | LLM result and job cache |
| Observability | structlog, Sentry, Prometheus + Grafana, OpenTelemetry | |
| Testing | pytest, pytest-asyncio, httpx, factory_boy, Playwright | |
| Quality | ruff, mypy, pre-commit, bandit | |
| Containers/CI | Docker, docker-compose, GitHub Actions | |
| Hosting | Render / Fly.io / AWS ECS | |

## 3. Module Design

### 3.1 `auth`
Registration, login, OAuth (Google), email verification, password reset, session/JWT, RBAC (user, admin).

### 3.2 `resume`
- `parser`: file to text to structured JSON.
- `schema`: JSON Resume-compatible Pydantic models.
- `editor`: CRUD for sections, versioning.
- `renderer`: templates to HTML to PDF/DOCX.

### 3.3 `analysis`
- `rules`: deterministic checks.
- `llm_scorer`: prompts + Pydantic-validated JSON output.
- `matcher`: embedding similarity between resume and JD.
- `aggregator`: weighted final score and report persistence.

### 3.4 `jobs`
- `providers/`: one adapter per source implementing `JobProvider.fetch(query) -> list[RawJob]`.
- `normalizer`: common schema, dedupe, skill extraction.
- `ranker`: hybrid scoring.
- `tracker`: application statuses.

### 3.5 `learning`
- `gap`: skills diff and frequency ranking.
- `roadmap`: LLM generation grounded in curated topic graph.
- `resources`: retrieval + link validation + ranking.
- `progress`: completion tracking.

### 3.6 `core`
Config (pydantic-settings), logging, rate limiting, error handling, LLM client wrapper (retry, timeout, cost tracking, caching).

## 4. Data Model (core tables)
```
users(id, email, password_hash, name, created_at, plan, locale)
profiles(user_id, target_roles[], locations[], remote_pref, salary_min, salary_max, experience_years)
resumes(id, user_id, title, is_primary, created_at)
resume_versions(id, resume_id, json_data JSONB, template, created_at, source_file_key)
analyses(id, resume_version_id, job_id NULL, overall_score, category_scores JSONB, issues JSONB, model, created_at)
skills(id, name, normalized_name, category, esco_id NULL)
user_skills(user_id, skill_id, level, source)
jobs(id, source, external_id, title, company, location, remote, salary_min, salary_max,
     description, apply_url, posted_at, fetched_at, embedding VECTOR(1024), dedupe_hash UNIQUE)
job_skills(job_id, skill_id, importance)
job_matches(user_id, job_id, score, explanation JSONB, computed_at)
applications(id, user_id, job_id, resume_version_id, cover_letter, status, applied_at, notes)
roadmaps(id, user_id, target_role, content JSONB, created_at)
roadmap_items(id, roadmap_id, topic, stage, est_hours, status, order_idx)
resources(id, topic, title, url, type, provider, quality_score, last_checked_at, is_curated)
audit_log(id, user_id, action, ip, ts)
```
Indexes: GIN on JSONB where queried, HNSW/IVFFlat on `jobs.embedding`, unique `dedupe_hash`, btree on (user_id, status).

## 5. API Design (REST, versioned `/api/v1`)
| Endpoint | Method | Purpose |
|---|---|---|
| `/auth/register`, `/auth/login`, `/auth/oauth/google` | POST/GET | Auth |
| `/resumes` | POST (upload), GET | Create/list |
| `/resumes/{id}/versions` | GET/POST | Versioning |
| `/resumes/{id}/export?format=pdf` | GET | Export |
| `/resumes/{id}/ai/rewrite` | POST | Bullet rewrite |
| `/analysis` | POST | Start analysis (returns task_id) |
| `/analysis/{id}` | GET | Report |
| `/profile/goals` | PUT | Career goals |
| `/jobs/matches` | GET | Ranked jobs (filters, pagination) |
| `/jobs/{id}/tailor` | POST | Tailored resume + cover letter |
| `/applications` | POST/GET/PATCH | Track applications |
| `/learning/gaps` | GET | Skill gaps |
| `/learning/roadmaps` | POST/GET | Generate/list |
| `/learning/roadmaps/{id}/items/{iid}` | PATCH | Progress |
| `/tasks/{id}` | GET | Task status (or SSE `/tasks/{id}/stream`) |
| `/account/export`, `/account` | GET/DELETE | Data portability and deletion |

Conventions: Pydantic request/response models, cursor pagination, consistent error envelope, idempotency keys on POST that start jobs.

## 6. AI/LLM Design
- **Provider abstraction:** `LLMClient` interface (complete, structured_complete, embed) with a Claude implementation; swap-friendly.
- **Structured outputs:** every call has a Pydantic schema; invalid output triggers one repair retry, then fails gracefully.
- **Prompt management:** versioned prompt files in `prompts/` with a version tag stored on each analysis.
- **Grounding:** analysis cites resume text spans; roadmaps use curated topic graph; resources chosen only from retrieved candidates (no invented URLs).
- **Cost controls:** cache by content hash, truncate/chunk inputs, use smaller models for extraction/classification and larger for generation, per-user quotas.
- **Evaluation:** golden set of 50-100 resumes with human scores; track score correlation, JSON validity rate, hallucination rate; regression run in CI on prompt changes.
- **Safety:** prompt-injection defense (treat resume/JD text as untrusted data, delimiters, no tool execution from document content), PII redaction before logging.

## 7. Job Ranking Algorithm
```
final = 0.50*cosine(resume_emb, job_emb)
      + 0.25*skill_overlap_ratio(user_skills, job_skills weighted by importance)
      + 0.10*seniority_fit
      + 0.10*preference_fit(location, remote, salary)
      + 0.05*freshness_decay
```
Pre-filter in SQL (location, remote, salary, posted_at), vector top-200, then re-rank in Python. Weights tunable via config and A/B testing.

## 8. Resource Retrieval and Validation
1. Query curated `resources` table by topic.
2. If fewer than N results, call YouTube Data API and a web search API with topic-specific queries.
3. Async HEAD/GET check (timeout 5 s) to confirm links are alive.
4. Rank by source trust, recency, views/likes, and level fit; store with `last_checked_at`.
5. Nightly job re-validates links and flags dead ones.

## 9. Non-Functional Requirements
| Area | Target |
|---|---|
| Performance | API p95 < 500 ms (non-AI); analysis p95 < 30 s; job list < 2 s |
| Scalability | 10k MAU on a single region with horizontal worker scaling |
| Availability | 99.5% MVP |
| Reliability | Task retries with exponential backoff; idempotent workers; dead-letter queue |
| Maintainability | 80%+ coverage on core modules; typed code; ADRs |
| Accessibility | WCAG 2.1 AA |
| Localization | English first; i18n-ready |
| Browser support | Latest 2 versions of Chrome, Edge, Firefox, Safari |

## 10. Deployment and Environments
- Environments: local (docker-compose), staging, production.
- CI/CD: lint, type check, tests, security scan, build image, deploy on merge to main; Alembic migrations run as a release step.
- Config via environment variables; secrets in a secrets manager.
- Backups: daily DB snapshots, 7-30 day retention; tested restore quarterly.

## 11. Suggested Repository Layout
```
careerforge/
  app/
    main.py
    core/ (config.py, llm.py, security.py, logging.py)
    auth/ resume/ analysis/ jobs/ learning/
    templates/ static/
    workers/ (celery_app.py, tasks.py)
  prompts/
  migrations/
  tests/
  docker/
  docs/ (prd.md, trd.md, phases.md, skills.md, requirements.md, security.md)
  pyproject.toml
  docker-compose.yml
```

## 12. Third-Party Integration Notes
- Job sources: use official/partner APIs; store only the fields needed; always link back to the original apply URL; respect rate limits and attribution rules.
- YouTube Data API: quota-aware (cache results).
- Email: Postmark/SES for verification and digests.
- Payments (later): Stripe.

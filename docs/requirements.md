# Requirements

Includes functional requirements (FR), non-functional requirements (NFR), and the Python dependency list.

Priority: **M** = Must (MVP), **S** = Should, **C** = Could.

## 1. Functional Requirements

### Authentication and Account
| ID | Requirement | Pri |
|---|---|---|
| FR-A1 | Register/login with email + password | M |
| FR-A2 | Google OAuth login | M |
| FR-A3 | Email verification and password reset | M |
| FR-A4 | Profile and career goals management | M |
| FR-A5 | Export all user data (JSON/ZIP) | M |
| FR-A6 | Permanently delete account and data | M |

### Resume
| ID | Requirement | Pri |
|---|---|---|
| FR-R1 | Upload PDF/DOCX (<= 5 MB) | M |
| FR-R2 | Parse to structured sections with user correction UI | M |
| FR-R3 | Create resume from scratch via guided form | M |
| FR-R4 | Edit, add, remove, and reorder sections | M |
| FR-R5 | At least 3 ATS-safe templates | M |
| FR-R6 | Export PDF and DOCX | M |
| FR-R7 | Version history and multiple resumes | M |
| FR-R8 | AI rewrite for bullets and summary | M |
| FR-R9 | Live preview | S |

### Analysis
| ID | Requirement | Pri |
|---|---|---|
| FR-N1 | Overall score 0-100 with category breakdown | M |
| FR-N2 | List issues with severity and suggested fix | M |
| FR-N3 | One-click apply of suggestion to resume | S |
| FR-N4 | Score against a pasted or selected job description | M |
| FR-N5 | Score history and comparison between versions | S |
| FR-N6 | Explainability: each issue references the exact resume text | M |

### Jobs
| ID | Requirement | Pri |
|---|---|---|
| FR-J1 | Set target roles, locations, remote, salary | M |
| FR-J2 | Aggregate jobs from multiple legal sources | M |
| FR-J3 | Rank jobs with match % and reasons | M |
| FR-J4 | Filters and sorting (location, salary, date, remote) | M |
| FR-J5 | Save / hide jobs | M |
| FR-J6 | Generate tailored resume and cover letter per job | S |
| FR-J7 | Assisted apply (open official link) and status tracking | M |
| FR-J8 | Kanban application tracker with notes/reminders | S |
| FR-J9 | Opt-in auto-apply via ATS APIs with per-application confirmation | C |

### Learning
| ID | Requirement | Pri |
|---|---|---|
| FR-L1 | Skill gap list derived from top-N matched jobs | M |
| FR-L2 | Roadmap generation for a target role (staged, time-estimated) | M |
| FR-L3 | Curated resource links per topic, validated | M |
| FR-L4 | Progress tracking per roadmap item | S |
| FR-L5 | Suggest adding completed skills to resume (user confirms) | S |
| FR-L6 | Quizzes / self-assessment | C |

### Notifications
| ID | Requirement | Pri |
|---|---|---|
| FR-X1 | Transactional emails (verify, reset) | M |
| FR-X2 | Weekly digest of new matches | C |

## 2. Non-Functional Requirements
| ID | Requirement | Target |
|---|---|---|
| NFR-1 | API latency (non-AI) | p95 < 500 ms |
| NFR-2 | Resume analysis time | p95 < 30 s |
| NFR-3 | Availability | 99.5% (MVP) |
| NFR-4 | Scalability | 10k MAU, horizontal worker scaling |
| NFR-5 | Accessibility | WCAG 2.1 AA |
| NFR-6 | Browser support | Latest 2 versions of major browsers |
| NFR-7 | Test coverage | >= 80% on core modules |
| NFR-8 | Parsing accuracy | >= 90% on test corpus |
| NFR-9 | Link validity | 100% validated at generation |
| NFR-10 | Data backup | Daily, tested restore |
| NFR-11 | Privacy compliance | GDPR / India DPDP Act aligned |
| NFR-12 | Observability | Logs, metrics, traces, error alerts |

## 3. External Services and Accounts
- LLM provider API key (Anthropic Claude) + embedding model.
- Job APIs: Adzuna, Jooble, Remotive, JSearch (RapidAPI), The Muse, Greenhouse/Lever public boards.
- YouTube Data API key; a web search API (e.g. Brave Search / SerpAPI) for resource discovery.
- Email provider (Postmark/SES), object storage (S3/MinIO), Sentry.
- Payments (later): Stripe.

## 4. Python Dependencies (`pyproject.toml` sketch)
```
# Web / API
fastapi, uvicorn[standard], gunicorn, jinja2, python-multipart, itsdangerous
pydantic>=2, pydantic-settings, email-validator

# Data
sqlalchemy>=2, alembic, asyncpg, psycopg[binary], pgvector

# Auth / Security
authlib, passlib[argon2] or argon2-cffi, python-jose or pyjwt, slowapi, python-magic

# Background
celery, redis, flower (optional)

# Documents
pymupdf, pdfplumber, python-docx, weasyprint, pytesseract, pillow

# AI / NLP
anthropic, sentence-transformers (optional local embeddings), spacy, rapidfuzz, numpy, scikit-learn

# HTTP / utils
httpx, tenacity, beautifulsoup4 (only for permitted public pages), orjson, structlog

# Observability
sentry-sdk, prometheus-client, opentelemetry-sdk

# Dev / Test
pytest, pytest-asyncio, pytest-cov, factory-boy, respx, playwright, ruff, mypy, bandit, pre-commit, pip-audit
```

## 5. Environment Variables (example)
```
APP_ENV=production
SECRET_KEY=...
DATABASE_URL=postgresql+asyncpg://...
REDIS_URL=redis://...
S3_BUCKET=... S3_ENDPOINT=... S3_ACCESS_KEY=... S3_SECRET_KEY=...
ANTHROPIC_API_KEY=...
EMBEDDING_MODEL=...
ADZUNA_APP_ID=... ADZUNA_APP_KEY=...
RAPIDAPI_KEY=...
YOUTUBE_API_KEY=...
SEARCH_API_KEY=...
GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=...
SENTRY_DSN=...
```
All secrets must come from a secrets manager in production, never from the repo.

## 6. Dev Environment Setup
1. Install Python 3.12, Docker, and `uv` or `poetry`.
2. `docker compose up -d` (Postgres + pgvector, Redis, MinIO).
3. `alembic upgrade head`.
4. `uvicorn app.main:app --reload` and `celery -A app.workers.celery_app worker -B`.
5. Run `pre-commit install` and `pytest`.

## 7. Constraints
- Use official APIs only; do not scrape platforms whose terms prohibit it.
- The AI must never add unverified claims to a resume without explicit user confirmation.
- All LLM calls must use schema-validated outputs and treat uploaded text as untrusted input.

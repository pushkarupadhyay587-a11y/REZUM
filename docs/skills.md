# Skills Required (Team and Technology)

Two lenses: (A) skills the **build team** needs, and (B) the **skills taxonomy** the product itself uses to analyze users.

---

## Part A: Build-Team Skills

### 1. Backend (Python)
| Skill | Level | Used for |
|---|---|---|
| Python 3.12, typing, async/await | Advanced | Whole backend |
| FastAPI, Pydantic v2 | Advanced | APIs, validation, LLM schemas |
| SQLAlchemy 2.0, Alembic | Advanced | ORM, migrations |
| PostgreSQL, indexing, JSONB | Intermediate-Adv | Data layer |
| pgvector / vector search basics | Intermediate | Job and resume matching |
| Celery, Redis, task design | Intermediate | Background jobs |
| REST design, pagination, idempotency | Intermediate | API quality |
| httpx, tenacity (retries), rate limiting | Intermediate | External APIs |

### 2. AI / ML
| Skill | Level | Used for |
|---|---|---|
| Prompt engineering for structured outputs | Advanced | Parsing, scoring, roadmaps |
| LLM API usage (Claude), tool/JSON-schema output | Advanced | Core AI features |
| Embeddings and semantic similarity | Intermediate | Matching and ranking |
| NLP basics (spaCy, tokenization, NER) | Intermediate | Skill extraction |
| Evaluation design (golden sets, metrics) | Intermediate | Quality and regression control |
| RAG / grounding patterns | Intermediate | Roadmaps, resource selection |
| Prompt-injection and LLM safety | Intermediate | Security |
| Cost/latency optimization, caching | Intermediate | Margin and UX |

### 3. Document Processing
- PDF/DOCX parsing (PyMuPDF, pdfplumber, python-docx), OCR (Tesseract).
- HTML/CSS to PDF (WeasyPrint); ATS-friendly document structure.

### 4. Frontend
| Skill | Level |
|---|---|
| HTML5, CSS3, Tailwind | Intermediate |
| Jinja2 templating, HTMX, Alpine.js | Intermediate |
| Accessibility (WCAG 2.1 AA) | Intermediate |
| JavaScript/React (only if SPA chosen later) | Optional |
| Responsive UX, form and editor UX | Intermediate |

### 5. DevOps / Platform
- Docker, docker-compose, CI/CD (GitHub Actions).
- Cloud basics (AWS/Fly/Render), S3, secrets management.
- Observability: Sentry, Prometheus/Grafana, structured logs.
- Nginx/Caddy, TLS, backups and restore.

### 6. Security
- OWASP Top 10, ASVS; secure file upload handling.
- AuthN/AuthZ, OAuth2/OIDC, session security, CSRF/XSS protection.
- Secrets handling, dependency scanning, threat modeling.
- Privacy engineering: GDPR/DPDP Act basics.

### 7. QA / Testing
- pytest, pytest-asyncio, factory_boy, mocking external APIs.
- E2E with Playwright; load testing (Locust/k6).
- LLM output testing (schema validity, regression on golden set).

### 8. Product, Design, Domain
- Product management: PRD writing, metrics, experiments.
- UX/UI design: resume templates, dashboards, onboarding.
- Domain knowledge: recruiting, ATS behavior, resume best practices, HR/career coaching input for rubric and roadmaps.
- Content curation: reviewing learning resources for quality.

### Suggested Team Composition (MVP)
| Role | Count |
|---|---|
| Full-stack Python engineer (lead) | 1 |
| Backend/AI engineer | 1 |
| Frontend-leaning engineer | 1 |
| Product/UX designer | 1 (part-time ok) |
| Domain advisor (recruiter/career coach) | 1 (advisory) |

---

## Part B: Product Skills Taxonomy (what the app models)

### Taxonomy sources
- **ESCO** (European skills taxonomy), **O*NET** (US occupational data), plus a custom alias table (e.g. "JS" = "JavaScript", "k8s" = "Kubernetes").
- Normalization: lowercase, alias map, fuzzy match (rapidfuzz), embedding fallback, human review queue for new terms.

### Skill record
```
skill: {id, name, aliases[], category, parent_id, esco_id?, onet_id?}
categories: Programming Language | Framework | Database | Cloud/DevOps | Data/ML |
            Design | Soft Skill | Domain Knowledge | Tool | Certification
```

### Proficiency levels
| Level | Meaning |
|---|---|
| 1 Beginner | Coursework / tutorials |
| 2 Working | Used in a project or internship |
| 3 Proficient | Used in production, independent |
| 4 Advanced | Leads design decisions, mentors |
| 5 Expert | Recognized authority |

Level is inferred from resume signals (years, project depth, certifications) and can be self-adjusted by the user.

### Gap Analysis Logic
```
required(job) = skills with importance weights from job description
gap(user, jobs) = sum over top-N jobs of importance(skill) for skills not in user_skills (or below needed level)
priority = frequency_in_top_jobs * importance * (1 / estimated_learning_hours)
```

### Starter Roadmap Library (curated topic graphs)
Python Developer, Backend (Python/FastAPI), Data Analyst, Data Scientist, ML Engineer, Frontend Developer, Full-Stack, DevOps Engineer, Cloud Engineer, Cybersecurity Analyst, QA/SDET, Product Manager, UI/UX Designer.

Each roadmap node: `{topic, stage, prerequisites[], est_hours, resources[]}`.

### Resource Quality Criteria
- Prefer official docs, reputable free courses (freeCodeCamp, CS50, MDN, Python docs), established YouTube educators, and roadmap.sh-style guides.
- Required metadata: type (video/article/course/docs/practice), level, duration, cost (free/paid), last verified date.
- Reject: dead links, paywalled-only without notice, outdated (> 3 years for fast-moving tech unless foundational), low-signal content.
- Every link validated automatically and reviewed by a human for curated core entries.

# Delivery Phases

Assumes a small team (2-4 engineers + 1 designer/PM). Durations are estimates; adjust to team size.

## Phase 0: Foundations (Week 1-2)
**Goal:** Project skeleton and decisions locked.
- Finalize PRD/TRD, pick LLM and job API providers, confirm legal basis for data processing.
- Repo, Docker compose (FastAPI, Postgres+pgvector, Redis), CI (ruff, mypy, pytest, bandit).
- Config management, logging, error handling, base templates and design system.
- Auth: signup/login, email verification, Google OAuth.
**Exit criteria:** `docker compose up` gives a running app with auth and CI green.

## Phase 1: Resume Core (Week 3-5)
**Goal:** Users can bring in and shape a resume.
- File upload with validation, storage, text extraction (PDF/DOCX/OCR fallback).
- LLM structured parsing to JSON Resume schema; review/correct UI.
- Section editor, versioning, 2-3 ATS-safe templates, PDF/DOCX export.
- AI assist: bullet rewrite, summary generation.
**Exit criteria:** 90% parse accuracy on test set; export opens correctly in Word and passes a basic ATS parse test.

## Phase 2: Analysis and Rating (Week 6-8)
**Goal:** Trustworthy, explainable resume score.
- Rule engine checks; LLM scorer with schema; weighted aggregator.
- JD-targeted scoring (embeddings + keyword overlap).
- Report UI (score ring, categories, issues with one-click apply).
- Golden evaluation set + regression harness; prompt versioning.
**Exit criteria:** Score correlates with human ratings (target r >= 0.7); p95 analysis < 30 s.

## Phase 3: Jobs Engine (Week 9-12)
**Goal:** Ranked, explainable job matches.
- Career goals onboarding; provider adapters (2-3 sources); normalizer and dedupe.
- Scheduled fetching (Celery beat), embeddings in pgvector, hybrid ranker.
- Job board UI with filters, match %, reasons; save job.
- Tailored resume and cover letter generation.
- Assisted apply flow and application tracker.
**Exit criteria:** Top-10 matches in < 10 s; user can apply through official link and track status.

## Phase 4: Learning Hub (Week 13-16)
**Goal:** Close the gap between profile and target roles.
- Skills taxonomy and normalization; gap analysis from top-N jobs.
- Curated topic graph (starter roadmaps for ~10 popular roles).
- LLM roadmap generation grounded in the graph; time estimates.
- Resource retrieval (curated + YouTube + search), link validation, quality ranking.
- Progress tracking; suggest adding completed skills to resume.
**Exit criteria:** 100% of shown links validated at generation time; roadmap generated < 20 s.

## Phase 5: Hardening and Beta (Week 17-19)
- Security review and pen-test pass (see security.md), rate limiting, abuse protection.
- Performance tuning, caching, load test to target concurrency.
- Observability dashboards and alerts; backup/restore drill.
- Accessibility audit; privacy policy, ToS, cookie consent; data export/delete.
- Closed beta with 50-100 users; collect feedback and NPS.
**Exit criteria:** No critical/high vulnerabilities open; beta metrics meet PRD targets.

## Phase 6: Public Launch (Week 20)
- Production deploy, monitoring, on-call rotation, status page.
- Pricing/billing (Stripe) if monetizing at launch.
- Marketing site, onboarding emails, support channel.

## Post-Launch Roadmap
| Release | Features |
|---|---|
| v1.1 | Kanban tracker polish, weekly email digest, quizzes, more templates |
| v1.2 | More job sources, region expansion, resume A/B insights |
| v2.0 | Opt-in auto-apply via ATS APIs, interview prep (mock Q&A), LinkedIn profile review (via user-provided export), mobile PWA |
| v2.x | Team/college plans, recruiter-side analytics (if desired) |

## Dependency Map
```
Phase 0 -> Phase 1 -> Phase 2 -> Phase 3 -> Phase 4 -> Phase 5 -> Phase 6
                         \________ (embeddings infra reused) ________/
```
Phases 3 and 4 can overlap partly once the skills taxonomy exists.

## Risks per Phase
| Phase | Key risk | Mitigation |
|---|---|---|
| 1 | Messy resume layouts break parsing | OCR fallback, manual correction UI, test corpus |
| 2 | Inconsistent LLM scores | Rubric + rule checks, low temperature, golden set |
| 3 | Limited job API coverage | Multi-provider, ATS public boards |
| 4 | Dead or low-quality links | Validation, curated core, nightly recheck |
| 5 | Security gaps found late | Security checklist from Phase 0, early threat model |

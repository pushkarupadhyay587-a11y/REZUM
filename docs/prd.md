# Product Requirements Document (PRD)

**Product:** CareerForge, an AI career copilot
**Version:** 1.0 (draft)
**Owner:** Product
**Last updated:** 2026-10-06

## 1. Overview
CareerForge helps job seekers build a better resume, understand how good it is, find and apply to the best-matching jobs, and close skill gaps through personalized roadmaps and curated learning resources, all in one web application.

## 2. Problem Statement
Job seekers juggle disconnected tools: resume builders, ATS checkers, job boards, and learning platforms. They rarely know why they get rejected, which jobs fit them, or what to learn next. Existing tools give generic feedback and no closed loop between resume, jobs, and skills.

## 3. Goals and Non-Goals
### Goals
- G1: Let users create/import and customize resumes quickly.
- G2: Provide an explainable AI score with actionable fixes.
- G3: Surface the top matching jobs and help the user apply with tailored materials.
- G4: Identify skill gaps and generate roadmaps with trustworthy resource links.
- G5: Create a feedback loop (learn, update resume, re-match).

### Non-Goals (v1)
- Fully automated mass-applying without user review.
- Scraping sites that prohibit it (LinkedIn, Indeed).
- Recruiter-side features / employer marketplace.
- Hosting video courses or issuing certifications.
- Native mobile apps (responsive web only).

## 4. Target Users and Personas
| Persona | Description | Key need |
|---|---|---|
| Fresh graduate (Aarav) | 0-1 yr, thin resume | Know what to put, what to learn, entry roles |
| Career switcher (Meera) | 3-8 yrs, changing domain | Transferable skills, gap roadmap |
| Experienced professional (Rohan) | 8+ yrs | Tailoring, ATS optimization, senior roles |
| Re-entrant | Career break | Confidence, updated skills |

## 5. User Stories
### Resume
- As a user, I can upload a PDF/DOCX and see it parsed into editable sections.
- As a user, I can pick a template, reorder sections, and export PDF/DOCX.
- As a user, I can ask AI to rewrite a bullet to be more impactful.
- As a user, I can keep multiple resume versions for different roles.

### Analysis
- As a user, I get an overall score (0-100) with category breakdown.
- As a user, I see specific issues with a suggested fix and can apply it in one click.
- As a user, I can score my resume against a specific job description.

### Jobs
- As a user, I set target roles, locations, remote preference, salary.
- As a user, I see a ranked list of jobs with match % and reasons.
- As a user, I can generate a tailored resume and cover letter for a job.
- As a user, I can apply via the official link and track the status.

### Learning
- As a user, I see my top missing skills across target jobs.
- As a user, I get a stage-wise roadmap with estimated time.
- As a user, I get working links to quality resources per topic.
- As a user, I can mark progress and see it reflected on my profile.

### Account
- As a user, I can export or delete all my data.

## 6. Functional Scope (MVP vs Later)
| Feature | MVP | v1.1 | v2 |
|---|---|---|---|
| Auth (email + Google) | Yes | | |
| Resume upload + parse | Yes | | |
| Editor + templates + export | Yes | | |
| AI score + suggestions | Yes | | |
| JD-targeted scoring | Yes | | |
| Job aggregation + ranking | Yes | | |
| Tailor resume / cover letter | | Yes | |
| Assisted apply + tracker | Yes (basic) | Yes (kanban) | |
| Skill gap analysis | Yes | | |
| Roadmaps + resource links | Yes | | |
| Progress tracking + quizzes | | Yes | |
| Auto-apply via ATS APIs | | | Yes |
| Interview prep (mock Q&A) | | | Yes |
| Email digests | | Yes | |
| Payments / subscriptions | | Yes | |

## 7. Success Metrics
- Activation: % of signups who upload/create a resume and view a score (target 60%).
- Resume improvement: average score uplift after edits (target +15 points).
- Job engagement: % of users who save or apply to at least 1 job in week 1 (target 40%).
- Learning engagement: % who start a roadmap (target 30%).
- 30-day retention (target 25%).
- Quality: <5% broken resource links; user rating of AI suggestions >4/5.
- Performance: analysis completes in <30 s p95.

## 8. Monetization (proposed)
- Free: 1 resume, 3 analyses/month, 10 job matches/week, 1 roadmap.
- Pro: unlimited analyses, tailoring, cover letters, unlimited roadmaps, digests.
- Optional later: team/college (placement cell) plans.

## 9. Assumptions and Dependencies
- LLM API availability and cost within budget.
- Job APIs offer sufficient coverage for target regions (India, US, remote first).
- Users consent to processing resume data (PII) by AI providers.

## 10. Risks and Mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| LLM hallucination (fake skills, links) | Trust loss | Schema-validated outputs, link validation, never auto-add claims to resume without confirmation |
| Job API limits/cost | Coverage gaps | Multi-source, caching, scheduled batch fetch |
| PII leakage | Legal/trust | Encryption, minimization, DPA with providers, deletion flow (see security.md) |
| Biased scoring | Fairness | Exclude protected attributes, audit prompts, transparent rubric |
| ToS violations by scraping | Legal | Official APIs only |
| High LLM costs | Margin | Caching, smaller models for simple steps, rate limits, quotas |

## 11. Open Questions
- Which geographies first (India-first job sources vs global)?
- Which LLM provider(s) and data-retention terms?
- Is auto-apply worth the legal and abuse risk for v2?
- Pricing and free-tier limits.

## 12. Acceptance Criteria (MVP)
- A new user can go from signup to a scored resume in under 5 minutes.
- Parsing correctly captures work, education, and skills for 90% of a 50-resume test set.
- Top-10 job list returned in under 10 s after goals are set.
- Every roadmap resource link resolves (HTTP 200) at generation time.
- Data export and account deletion work end to end.

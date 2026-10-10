# Security and Privacy Plan

Resumes contain highly sensitive PII (name, phone, address, employment history). Security and privacy are first-class requirements.

## 1. Security Principles
- Least privilege, defense in depth, secure by default.
- Data minimization: collect and retain only what is needed.
- Treat all uploaded content and third-party data as **untrusted**.
- Privacy by design: user controls, transparency, easy deletion.

## 2. Threat Model (STRIDE summary)
| Threat | Example | Mitigation |
|---|---|---|
| Spoofing | Credential stuffing, stolen sessions | Argon2, rate limits, MFA (later), secure cookies |
| Tampering | Modified request/IDs | Server-side validation, authz checks on every object |
| Repudiation | Disputed actions | Audit log for auth, export, delete, apply |
| Information disclosure | IDOR on resumes, leaked files | Ownership checks, signed short-lived URLs, encryption |
| Denial of service | Large uploads, LLM abuse | Size limits, quotas, rate limiting, timeouts |
| Elevation of privilege | Admin endpoint access | RBAC, separate admin surface, deny by default |

## 3. Authentication and Sessions
- Passwords hashed with **Argon2id**; enforce minimum length 12, check against breached-password list.
- Email verification required before AI features.
- Google OAuth via OIDC with state and PKCE.
- Sessions: HttpOnly, Secure, SameSite=Lax cookies, short TTL with rotation; JWTs (if used) short-lived with refresh rotation and revocation list.
- Brute-force protection: per-IP and per-account rate limits, progressive delays, lockout notifications.
- MFA (TOTP) planned for v1.1.
- Password reset tokens: single-use, short expiry, hashed in DB.

## 4. Authorization
- Every resource query scoped by `user_id` (prevent IDOR); centralized authorization dependency.
- Role-based access (user, admin); admin actions logged.
- Automated tests that verify cross-user access is denied.

## 5. Secure File Upload
- Allow only PDF and DOCX; verify extension, MIME type, and magic bytes.
- Max size 5 MB; page/length limits for parsing.
- Antivirus scan (ClamAV) before processing.
- Parse in a sandboxed worker (no network, low privileges, CPU/memory/time limits) to contain parser exploits.
- Strip active content (macros, embedded scripts, external links fetched automatically).
- Store with random object keys; never serve from the app origin; access via short-lived signed URLs.
- DOCX: reject macros (.docm), guard against zip bombs and XML entity expansion (use defusedxml).

## 6. LLM and AI-Specific Security
- **Prompt injection:** resume/JD text is data, not instructions. Use clear delimiters, a system prompt that forbids following embedded instructions, and no tool/action execution driven by document content.
- **Output validation:** Pydantic schema validation; strip or escape HTML in outputs; never render LLM output as raw HTML.
- **No invented links or credentials:** resource URLs come only from retrieved, validated candidates.
- **Data sharing:** use providers with zero/limited retention agreements and no training on customer data; document in privacy policy.
- **PII minimization:** redact unneeded identifiers (phone, address, DOB) before sending to the LLM where the task does not require them; never include secrets in prompts.
- **Abuse controls:** per-user token/cost quotas, request caps, anomaly alerts.
- **Fairness:** exclude protected attributes (age, gender, religion, photo, marital status) from scoring and matching; audit prompts and outcomes periodically; advise users to omit them.
- **Human in the loop:** AI suggestions never modify the resume or submit applications without user confirmation.

## 7. Data Protection
| Aspect | Control |
|---|---|
| In transit | TLS 1.2+ everywhere, HSTS, internal service TLS |
| At rest | DB and object storage encryption (AES-256, KMS-managed keys) |
| Field-level | Encrypt highly sensitive fields (phone, address) with application-level keys (optional) |
| Secrets | Secrets manager (AWS SM / Vault), rotation, no secrets in git (pre-commit secret scanning) |
| Backups | Encrypted, access-restricted, restore-tested |
| Logs | No PII/resume content in logs; structured logs with redaction |
| Retention | Resume files and analyses kept until user deletes; inactive accounts purged after defined period (e.g. 24 months) with notice |

## 8. Web Application Security (OWASP Top 10)
- **Injection:** SQLAlchemy parameterized queries only; no string-built SQL.
- **XSS:** Jinja2 autoescape on; sanitize rich text (bleach/nh3); strict Content-Security-Policy.
- **CSRF:** CSRF tokens for cookie-based sessions; SameSite cookies.
- **SSRF:** when validating resource links or fetching job pages, block private/loopback/link-local IP ranges, restrict schemes to http(s), enforce timeouts and size limits, no redirects to internal hosts.
- **Security headers:** CSP, X-Content-Type-Options, X-Frame-Options/frame-ancestors, Referrer-Policy, Permissions-Policy.
- **CORS:** explicit allowlist.
- **Rate limiting:** global and per-endpoint (slowapi + Redis); stricter on auth, upload, and AI endpoints.
- **Dependency risk:** pinned versions, `pip-audit`, Dependabot/Renovate, SBOM.
- **Error handling:** generic errors to clients; detailed errors only in internal logs.

## 9. Third-Party and Compliance Considerations
- Use job data only per each provider's terms; attribute and link back; do not scrape platforms prohibiting it.
- Auto-apply (if ever built) only via sanctioned ATS APIs, with explicit consent per application, to avoid account bans and spam.
- Vendor due diligence: DPAs with LLM, email, storage, and analytics vendors; list sub-processors.
- Regulations: GDPR (EU users), India DPDP Act 2023, CCPA where applicable. Provide privacy policy, ToS, consent capture, cookie banner, data subject request handling (access, correction, export, deletion within defined SLA).
- Note on AI hiring regulation: some jurisdictions regulate automated employment decision tools; since CareerForge serves candidates (not employers) risk is lower, but keep transparency about how scores are produced.

## 10. Infrastructure Security
- Network: private subnets for DB/Redis/workers; only the load balancer is public.
- Containers: minimal base images, non-root user, read-only filesystem where possible, image scanning (Trivy).
- IAM: least-privilege roles per service; no shared credentials.
- CI/CD: signed commits optional, protected main branch, mandatory reviews, secrets scoped to environments.
- WAF/CDN (Cloudflare) with bot protection on public endpoints.

## 11. Monitoring, Logging, and Incident Response
- Centralized logs with retention; alerts for auth anomalies, spikes in 4xx/5xx, upload failures, LLM cost anomalies.
- Audit trail for login, password change, export, deletion, admin actions.
- **Incident response plan:** detect, triage, contain, eradicate, recover, notify. Breach notification within legal timelines (e.g. 72 hours under GDPR; follow DPDP rules for India).
- Run tabletop exercise before launch; maintain on-call and runbooks.

## 12. Security Testing
| Activity | Frequency |
|---|---|
| SAST (bandit, ruff security rules, Semgrep) | Every PR |
| Dependency audit (pip-audit) | Every PR + weekly |
| Secret scanning (gitleaks) | Every PR |
| DAST (OWASP ZAP) | Per release on staging |
| Authorization test suite (IDOR) | Every PR |
| Prompt-injection test suite (malicious resumes/JDs) | On prompt/model changes |
| Penetration test (external) | Before public launch, then annually |
| Backup restore drill | Quarterly |

## 13. User Privacy Controls
- Clear consent for AI processing at upload.
- Settings page: view/download data, delete resumes, delete account, opt out of analytics and digests.
- Account deletion cascades to files, embeddings, analyses, and applications within 30 days, and backups age out per retention policy.
- No selling of user data; no sharing resumes with employers without explicit user action.

## 14. Pre-Launch Security Checklist
- [ ] Threat model reviewed and signed off
- [ ] All endpoints enforce authN/authZ; IDOR tests pass
- [ ] Upload pipeline sandboxed and AV-scanned
- [ ] Rate limits and quotas active
- [ ] Prompt-injection tests pass; output validation enforced
- [ ] Secrets in manager; none in repo or logs
- [ ] TLS, HSTS, security headers verified
- [ ] Encryption at rest enabled; backups tested
- [ ] Privacy policy, ToS, DPAs in place
- [ ] Data export and deletion verified end to end
- [ ] Pen-test findings (critical/high) resolved
- [ ] Incident response runbook and contacts ready

# Codex Branch Task — Public API BFF and Contract Cleanup

## Branch

```text
feat/public-api-bff
```

## Prerequisite

Update from the accepted shell/design-system baseline before implementation.

## Objective

Build a clean, versioned, same-origin Nuxt/Nitro BFF API foundation. This branch owns API conventions, security primitives and mocked upstream adapters—not final form UI or production middleware credentials.

## Required endpoints

```text
GET  /api/v1/public/config
GET  /api/v1/health
GET  /api/v1/ready
POST /api/v1/leads/demo
POST /api/v1/leads/sales
POST /api/v1/leads/pricing
POST /api/v1/leads/developer-interest
POST /api/v1/leads/partner-application
POST /api/v1/leads/migration-consultation
POST /api/v1/support/contact
POST /api/v1/subscriptions/newsletter
POST /api/v1/tools/pricing-estimate
POST /api/v1/tools/domain-readiness
POST /api/v1/tools/api-sandbox
```

Form/tool handlers may use typed fixtures and a mocked durable adapter in this branch.

## Required implementation

- Versioned `/api/v1` route organization.
- Shared request context and request-ID generation/propagation.
- Typed validation schemas.
- Common success envelopes.
- RFC 7807-style `application/problem+json` errors.
- Stable machine-readable error codes.
- Idempotency-key validation and storage interface.
- Same-key/same-payload duplicate behavior.
- Same-key/different-payload conflict behavior.
- Origin and CSRF controls for browser writes.
- Request body limits.
- Per-route cost/rate-limit interface.
- Safe redirect/allowed-host utility.
- Timeout, bounded retry and circuit interfaces for future middleware client.
- Privacy-safe structured logging.
- Public runtime configuration allowlist.
- Health and readiness behavior.
- Generated or documented OpenAPI-compatible contracts and examples.
- Mocked middleware accepted/rejected/unavailable responses.

## Error codes

At minimum:

```text
VALIDATION_ERROR
ORIGIN_DENIED
CSRF_DENIED
BODY_TOO_LARGE
IDEMPOTENCY_REQUIRED
IDEMPOTENCY_CONFLICT
RATE_LIMITED
CONSENT_REQUIRED
CAPTCHA_REQUIRED
CAPTCHA_FAILED
CONFIGURATION_UNAVAILABLE
MIDDLEWARE_UNAVAILABLE
MIDDLEWARE_REJECTED
SERVICE_DEGRADED
```

## Security rules

- No stack traces or raw upstream bodies returned.
- No middleware URL or credential in public config.
- No arbitrary URL fetching.
- No open redirect.
- No secret values in logs.
- No direct Odoo/n8n access.
- No non-idempotent retry without stable idempotency.

## Required tests

- Request-ID propagation/generation.
- Problem response schema.
- Validation failures.
- Origin/CSRF denial.
- Body-size rejection.
- Rate-limit response and retry metadata.
- Idempotent duplicate and conflict.
- Safe redirect allowlist.
- Public config secret exclusion.
- Health/readiness states.
- Middleware mock acceptance, timeout, rejection and degraded behavior.
- No stack trace/secret leakage.
- API contract snapshot/validation.
- Type check, lint, unit/integration tests and production build.

## Git delivery

Push only this branch, open/update one draft PR and post exact endpoint/contract coverage. Stop before forms or real integration work.

## Prohibited

- No production middleware credential.
- No browser form implementation beyond test fixtures.
- No direct Odoo/n8n calls.
- No Docker/Caddy/deployment changes.

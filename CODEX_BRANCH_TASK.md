# Codex Branch Task — Public API BFF, Service Layer and Contract Cleanup

## Branch

```text
feat/public-api-bff
```

## Status

```text
FEATURE_STATUS=SCAFFOLDED
APPLICATION_CODE_PRESENT=NO
API_ENDPOINTS_IMPLEMENTED=NO
STAGING_CHANGED=NO
PRODUCTION_CHANGED=NO
```

## Prerequisites

Before implementation, recreate/update this branch from accepted:

```text
refactor/modular-website-architecture
feat/site-shell-design-system
```

Read completely:

1. `docs/IMPLEMENTATION_STATUS_AND_RELEASE_TRUTH.md`
2. `docs/REPOSITORY_ARCHITECTURE_AND_API_CATALOG.md`
3. `docs/API_FORM_CTA_CONTRACT.md`
4. `docs/LEGAL_PRIVACY_COOKIE_COMPLIANCE.md`
5. `docs/BRANCH_AND_DELIVERY_PLAN.md`
6. the remaining website, integration, SEO, security, Docker, Caddy, and release contracts.

## Objective

Build a clean, versioned, same-origin Nuxt/Nitro BFF foundation with thin route handlers, shared contracts, centralized security primitives, application services, mocked durable adapters, and a complete API manifest.

This branch owns API conventions and contract-ready endpoint behavior. It does not own final form UI, final legal pages, real production middleware credentials, Docker, Caddy, staging, or production.

## Required structure

Use the modular structure defined in `docs/REPOSITORY_ARCHITECTURE_AND_API_CATALOG.md`:

```text
apps/web/server/api/v1
apps/web/server/services
apps/web/server/repositories
apps/web/server/adapters
apps/web/server/schemas
apps/web/server/errors
apps/web/server/observability
packages/contracts
```

Route handlers remain thin. Do not put retry loops, Odoo/n8n mapping, consent policy, logging of raw payloads, or inline environment parsing in handlers.

## Required endpoint catalog

### Runtime and public configuration

```text
GET /api/v1/health
GET /api/v1/ready
GET /api/v1/public/config
GET /api/v1/public/navigation
GET /api/v1/public/features
GET /api/v1/public/pricing
GET /api/v1/public/legal-documents
GET /api/v1/public/legal-documents/:slug
```

### Cookie and consent contracts

```text
GET  /api/v1/consent/cookies/config
GET  /api/v1/consent/cookies/current
PUT  /api/v1/consent/cookies
POST /api/v1/consent/cookies/reset
```

This branch may use typed fixtures for legal documents and cookie registry data. Final UI, legal publication state, and consent script gating belong to `feat/legal-privacy-cookie-center`.

### Lead and consultation operations

```text
POST /api/v1/leads/demo
POST /api/v1/leads/sales
POST /api/v1/leads/pricing
POST /api/v1/leads/developer-interest
POST /api/v1/leads/partner-application
POST /api/v1/leads/migration-consultation
POST /api/v1/leads/dpa-request
POST /api/v1/leads/security-consultation
```

### Support, abuse, and security

```text
POST /api/v1/support/contact
POST /api/v1/abuse/report
POST /api/v1/security/report
```

### Subscriptions and legal updates

```text
POST /api/v1/subscriptions/newsletter
POST /api/v1/subscriptions/subprocessor-updates
POST /api/v1/subscriptions/legal-updates
```

### Privacy operations

```text
POST /api/v1/privacy/requests
GET  /api/v1/privacy/requests/:publicToken
POST /api/v1/privacy/opt-out
```

Use safe fixtures/status repositories in this branch. No external-system deletion or real privacy fulfillment.

### Interactive tool contracts

```text
POST /api/v1/tools/pricing-estimate
POST /api/v1/tools/domain-readiness
POST /api/v1/tools/api-sandbox
POST /api/v1/tools/migration-plan
GET  /api/v1/tools/content-search
```

Tools may use fixtures. No real email, billing, arbitrary URL fetch, private-network probe, Odoo/n8n call, or production provider.

## Required API implementation

### Request context

- request ID generation/propagation;
- receipt timestamp;
- locale resolution;
- route/operation ID;
- privacy-safe client classification;
- correlation ID support.

### Shared schemas

- define once in `packages/contracts`;
- consume from client-facing fixtures and server routes;
- strict input limits;
- no duplicate ad hoc request types;
- no unbounded `any`.

### Responses

- common safe success envelope;
- `application/problem+json` errors;
- stable machine-readable codes;
- no stack traces/raw upstream payloads/internal paths/secrets.

### Idempotency

- required for externally visible writes;
- key validation;
- request fingerprint;
- same key/same payload duplicate response;
- same key/different payload `409`;
- in-progress duplicate behavior;
- storage interface and deterministic test repository.

### Browser security

- allowed-origin policy;
- CSRF protection for state-changing browser requests;
- body limits;
- route-specific rate/cost limits;
- safe redirect/allowed-host utility;
- optional CAPTCHA adapter interface;
- no open redirect/proxy/URL-fetch behavior.

### Middleware boundary

Create a mocked `MiddlewareAdapter` with:

```text
accepted with durable receipt
accepted duplicate
rejected
unavailable
timeout
malformed response
circuit open
```

User-facing success is permitted only for the durable accepted/duplicate fixtures.

### Configuration

- typed centralized configuration;
- public safe allowlist;
- server secret exclusion;
- startup validation;
- optional integration disabled/degraded state;
- public-config bundle/response tests.

### Observability

- structured logs with request/operation IDs;
- no full form/free-text/privacy payloads;
- request duration/status metrics;
- acceptance/duplicate/rejection metrics;
- rate-limit and dependency-state metrics.

### API documentation

Generate or validate:

- OpenAPI-compatible operation manifest;
- request/response examples;
- stable error-code catalog;
- form-to-endpoint registry;
- operation ownership/dependency map;
- public versus server-only classification.

## Minimum error codes

```text
VALIDATION_ERROR
MALFORMED_REQUEST
ORIGIN_DENIED
CSRF_DENIED
BODY_TOO_LARGE
IDEMPOTENCY_REQUIRED
IDEMPOTENCY_CONFLICT
REQUEST_IN_PROGRESS
RATE_LIMITED
CONSENT_REQUIRED
CAPTCHA_REQUIRED
CAPTCHA_FAILED
CONFIGURATION_UNAVAILABLE
LEGAL_DOCUMENT_UNAVAILABLE
PRIVACY_REQUEST_NOT_FOUND
PUBLIC_TOKEN_INVALID
PUBLIC_TOKEN_EXPIRED
MIDDLEWARE_UNAVAILABLE
MIDDLEWARE_REJECTED
MIDDLEWARE_RESPONSE_INVALID
SERVICE_DEGRADED
TOOL_LIMIT_EXCEEDED
UNSAFE_DESTINATION
```

## Status codes

```text
200 successful read/tool operation
202 durable write acceptance
400 malformed/idempotency-required
403 origin/CSRF denied
404 unknown public resource/token
409 idempotency conflict
410 expired public token when appropriate
413 body too large
422 validation error
429 rate limited
503 required configuration/dependency unavailable
```

## Required tests

### Common API

- request-ID generation/propagation;
- success/problem schemas;
- validation and normalization;
- origin/CSRF denial;
- body/cost/rate limits and retry metadata;
- idempotent duplicate/conflict/in-progress;
- safe redirect allowlist;
- public config secret exclusion;
- health/readiness states;
- no stack trace/secret/internal detail leakage.

### Endpoint registry

- every required endpoint exists;
- unique operation IDs;
- no unversioned public write endpoints;
- every form maps to exactly one endpoint;
- public/legal/consent/privacy/tool operations match shared contracts;
- OpenAPI/manifest snapshot passes.

### Middleware fixtures

- durable acceptance;
- duplicate acceptance;
- timeout;
- rejection;
- malformed response;
- circuit open/degraded;
- false-success prevention.

### Privacy/security

- public status-token isolation/expiry fixture;
- no privacy/free-text body in logs;
- no arbitrary network call from tool fixtures;
- public legal fixtures do not expose draft content as approved.

### Quality

- type check;
- lint;
- unit/integration/contract tests;
- production build;
- dependency audit;
- secret scan.

## Git delivery

Push only this branch, update draft PR #7 with exact endpoint and contract evidence, and stop before `feat/legal-privacy-cookie-center` or form UI work.

## Prohibited

- no production middleware credential;
- no final form/legal UI;
- no direct Odoo/n8n/database access;
- no external privacy deletion;
- no real email/billing;
- no Docker/Caddy/deployment;
- no production change;
- no invented endpoint success evidence.
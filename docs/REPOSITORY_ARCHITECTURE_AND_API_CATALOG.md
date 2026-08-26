# Klyrow Website — Modular Repository Architecture and API Catalog

## 1. Objective

Build the public website as a clean, modular Nuxt application rather than a collection of unrelated page files, duplicated form handlers, and one-off API routes.

This architecture is intentionally designed for:

- a large bilingual content surface;
- reusable design and legal-document systems;
- versioned same-origin APIs;
- durable middleware integration;
- independently testable feature modules;
- Docker/Caddy deployment;
- future growth without turning the repository into a monolith.

## 2. Workspace structure

Use a lightweight pnpm workspace. Do not introduce Nx, Turborepo, or another orchestration layer unless measured build needs justify it.

```text
/
├── apps/
│   └── web/
│       ├── app/
│       │   ├── assets/
│       │   ├── components/
│       │   │   ├── base/
│       │   │   ├── navigation/
│       │   │   ├── content/
│       │   │   ├── conversion/
│       │   │   ├── forms/
│       │   │   ├── legal/
│       │   │   ├── tools/
│       │   │   └── feedback/
│       │   ├── composables/
│       │   ├── layouts/
│       │   ├── middleware/
│       │   ├── pages/
│       │   │   ├── [...content].vue
│       │   │   ├── es/[...content].vue
│       │   │   ├── legal/
│       │   │   └── utility/
│       │   ├── plugins/
│       │   ├── stores/
│       │   ├── types/
│       │   ├── utils/
│       │   └── app.vue
│       ├── content/
│       │   ├── en/
│       │   └── es/
│       ├── legal/
│       │   ├── en/
│       │   ├── es/
│       │   └── registry.ts
│       ├── public/
│       ├── server/
│       │   ├── api/
│       │   │   └── v1/
│       │   │       ├── public/
│       │   │       ├── consent/
│       │   │       ├── leads/
│       │   │       ├── support/
│       │   │       ├── subscriptions/
│       │   │       ├── privacy/
│       │   │       ├── legal/
│       │   │       ├── abuse/
│       │   │       ├── security/
│       │   │       └── tools/
│       │   ├── adapters/
│       │   │   ├── middleware/
│       │   │   ├── captcha/
│       │   │   ├── analytics/
│       │   │   ├── dns/
│       │   │   └── storage/
│       │   ├── errors/
│       │   ├── middleware/
│       │   ├── observability/
│       │   ├── repositories/
│       │   ├── schemas/
│       │   ├── services/
│       │   └── utils/
│       ├── tests/
│       │   ├── unit/
│       │   ├── component/
│       │   ├── integration/
│       │   ├── contract/
│       │   ├── browser/
│       │   ├── accessibility/
│       │   └── performance/
│       ├── nuxt.config.ts
│       └── package.json
├── packages/
│   ├── contracts/
│   │   ├── api/
│   │   ├── events/
│   │   ├── forms/
│   │   ├── legal/
│   │   └── index.ts
│   ├── content-schema/
│   ├── design-tokens/
│   ├── i18n/
│   ├── analytics-contracts/
│   ├── test-utils/
│   └── eslint-config/
├── ops/
│   ├── caddy/
│   ├── compose/
│   ├── docker/
│   ├── runbooks/
│   └── scripts/
├── docs/
├── .github/workflows/
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
└── pnpm-lock.yaml
```

## 3. Dependency rules

Allowed dependency direction:

```text
pages/components
      ↓
composables/client services
      ↓
shared contracts

server API routes
      ↓
application services
      ↓
repositories/adapters
      ↓
external middleware or local persistence
```

Prohibited:

- page components importing server-only adapters;
- API handlers containing Odoo/n8n mapping logic;
- components performing direct `fetch` calls to Odoo, n8n, or middleware;
- services importing Vue components;
- repositories returning raw external provider payloads to APIs;
- one shared `utils.ts` or `api.ts` file containing unrelated domains;
- duplicate schemas for the same request in frontend and backend;
- route-specific copies of error and request-ID logic.

## 4. Domain modules

Each domain has one clear owner.

### Content

Owns:

- route metadata;
- English and Spanish content;
- related-page links;
- breadcrumbs;
- route manifest;
- feature/integration/resource content schemas.

### Conversion

Owns:

- CTA registry;
- popup and announcement policies;
- pricing and plan display;
- use-case selection;
- scheduling handoff;
- conversion analytics contracts.

### Forms

Owns:

- form definitions;
- field schemas;
- client and server validation;
- accessible states;
- idempotency-key creation;
- consent evidence capture;
- attribution capture.

### Public API/BFF

Owns:

- `/api/v1` conventions;
- request context;
- problem responses;
- CSRF/origin checks;
- rate/body/cost limits;
- idempotency interface;
- safe public configuration;
- middleware adapter interface;
- health/readiness.

### Legal and privacy

Owns:

- legal-document registry;
- document versioning and publication status;
- cookie registry and categories;
- cookie preference APIs;
- privacy-request flows;
- anti-spam, acceptable-use, DPA, subprocessor, accessibility, and security-disclosure pages;
- legal-page indexing rules.

### Integrations

Owns:

- authenticated middleware client;
- durable acceptance contract;
- website event schemas;
- Odoo mapping contracts;
- n8n non-authoritative workflow contracts;
- retries, circuit state, metrics, and correlation.

### Interactive tools

Owns:

- pricing estimator;
- DNS-only domain readiness;
- API sandbox;
- migration chooser;
- public content search.

No tool may trigger real email, billing, Odoo accounting, unrestricted n8n execution, or arbitrary network access.

## 5. Naming conventions

- files and directories: `kebab-case`;
- Vue components: `PascalCase.vue`;
- composables: `useFeatureName.ts`;
- services: `<domain>.service.ts`;
- repositories: `<domain>.repository.ts`;
- adapters: `<provider>.adapter.ts`;
- schemas: `<operation>.schema.ts`;
- API routes: Nuxt route convention, grouped under `server/api/v1`;
- event names: `klyrow.website.<domain>.<action>.v1`;
- error codes: uppercase stable identifiers;
- IDs: prefixed opaque IDs such as `req_`, `sub_`, `evt_`, `opr_`, `cns_`, `prv_`.

## 6. Shared request context

Every API request receives one immutable request context:

```ts
interface RequestContext {
  requestId: string
  receivedAt: string
  locale: 'en' | 'es'
  routeId: string
  clientClass: 'browser' | 'server' | 'test'
  ipHash?: string
  userAgentClass?: string
  correlationId?: string
}
```

Do not pass raw IP addresses or full user agents through unrelated layers unless a documented security purpose requires them.

## 7. Success and error envelopes

Success:

```json
{
  "request_id": "req_...",
  "status": "accepted",
  "received_at": "2026-08-26T00:00:00Z",
  "data": {}
}
```

Errors use `application/problem+json`:

```json
{
  "type": "https://klyrow.com/problems/validation-error",
  "title": "We could not process this request",
  "status": 422,
  "code": "VALIDATION_ERROR",
  "detail": "Review the highlighted fields.",
  "request_id": "req_...",
  "errors": []
}
```

No API returns raw exceptions, stack traces, provider responses, secret names, internal file paths, Odoo model internals, n8n webhook URLs, or middleware credentials.

## 8. Complete public API catalog

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

Public endpoints return only approved, non-secret, cacheable data. Legal-document responses include document ID, locale, version, effective date, last updated date, publication status, canonical route, and rendered content or content reference.

### Cookie and consent preferences

```text
GET /api/v1/consent/cookies/config
GET /api/v1/consent/cookies/current
PUT /api/v1/consent/cookies
POST /api/v1/consent/cookies/reset
```

Rules:

- necessary cookies cannot be disabled when technically required;
- analytics and marketing are off until allowed by the applicable preference mode;
- the user may reject non-essential categories as easily as accepting them;
- preference changes take effect immediately where technically possible;
- consent records include version, categories, timestamp, locale, source, and a pseudonymous consent ID;
- no advertising or analytics identifier is written before the relevant decision permits it;
- GPC/opt-out preference signals are captured and honored when the configured legal mode requires it;
- cookie inventory comes from a typed registry, not prose maintained separately from code.

### Lead and consultation forms

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

### Support, abuse, and security contact

```text
POST /api/v1/support/contact
POST /api/v1/abuse/report
POST /api/v1/security/report
```

Security reports must warn users not to submit active credentials and must support an environment-configured security contact or disclosure destination.

### Newsletter and legal updates

```text
POST /api/v1/subscriptions/newsletter
POST /api/v1/subscriptions/subprocessor-updates
POST /api/v1/subscriptions/legal-updates
```

All marketing subscriptions require explicit consent evidence. Subprocessor/legal update subscriptions remain distinct from general marketing consent.

### Privacy requests

```text
POST /api/v1/privacy/requests
GET  /api/v1/privacy/requests/:publicToken
POST /api/v1/privacy/opt-out
```

Supported request types:

```text
ACCESS
CORRECTION
DELETION
PORTABILITY
OBJECTION
RESTRICT_PROCESSING
OPT_OUT_SALE_OR_SHARING
LIMIT_SENSITIVE_USE
OTHER
```

The public status token must be random, scoped, expiring, rate limited, and must never expose the requester's full personal data.

### Interactive tools

```text
POST /api/v1/tools/pricing-estimate
POST /api/v1/tools/domain-readiness
POST /api/v1/tools/api-sandbox
POST /api/v1/tools/migration-plan
GET  /api/v1/tools/content-search
```

Tool limits:

- no arbitrary URL fetching;
- no private-network probing;
- no real email;
- no real billing;
- no direct Odoo or n8n call;
- strict input, time, result-size, and rate limits.

## 9. API implementation layers

Each API route should remain thin:

```ts
export default defineEventHandler(async (event) => {
  const context = await requestContext(event)
  const input = await parseValidatedBody(event, schema)
  const result = await service.execute(context, input)
  return success(context, result)
})
```

The route must not contain:

- data mapping for Odoo;
- retry loops;
- raw logging of form bodies;
- consent policy logic duplicated from services;
- ad hoc ID generation;
- inline environment parsing;
- hard-coded third-party URLs;
- copied error-response construction.

## 10. Middleware adapter contract

```ts
interface MiddlewareAdapter {
  submitWebsiteEvent(
    context: RequestContext,
    event: WebsiteEvent,
    options: { idempotencyKey: string; timeoutMs: number }
  ): Promise<DurableAcceptance>
}
```

`DurableAcceptance` must prove persistence through an approved receipt ID. A `200` or `202` without the required durable receipt contract is not enough to show success to the user.

## 11. Idempotency

Externally visible writes require `Idempotency-Key`.

The idempotency record stores:

- key hash;
- operation name;
- request fingerprint;
- status;
- safe response snapshot;
- submission/operation ID;
- created and expiry timestamps.

Behavior:

```text
same key + same fingerprint -> return original safe response
same key + different fingerprint -> 409 IDEMPOTENCY_CONFLICT
missing key -> 400 IDEMPOTENCY_REQUIRED
in-progress duplicate -> deterministic retry response
```

## 12. Validation ownership

Define schemas once in `packages/contracts` and use them from client form adapters and server routes.

Client validation improves usability. Server validation remains authoritative.

Validation must cover:

- normalized Unicode and whitespace;
- email normalization without dangerous assumptions;
- phone normalization when supplied;
- enum and length limits;
- safe URL validation without fetching;
- no control characters;
- message body limits;
- UTM allowlist;
- locale allowlist;
- consent version;
- anti-abuse fields;
- tool-specific cost limits.

## 13. Configuration

All environment access is centralized in a typed configuration module.

Classify settings:

```text
PUBLIC_SAFE
SERVER_SECRET
SERVER_NON_SECRET
RELEASE_REQUIRED
OPTIONAL_INTEGRATION
```

The public configuration endpoint may return only `PUBLIC_SAFE` settings.

Startup validation must fail closed for missing release-required values. Optional integrations may start in disabled/degraded mode when documented.

## 14. Observability

Structured logs include:

- timestamp;
- severity;
- event name;
- request ID;
- operation/submission ID;
- route ID;
- duration;
- result class;
- retry count where relevant.

Logs exclude:

- full form payloads;
- passwords;
- API keys;
- CAPTCHA tokens;
- complete phone numbers;
- free-text support messages;
- middleware/Odoo/n8n credentials;
- legal-request evidence bodies.

Metrics cover:

- request count/latency/status;
- validation errors by safe code;
- form acceptance/duplicate/failure;
- middleware durable-acceptance latency;
- rate-limit decisions;
- cookie preference changes by category without identity;
- privacy request counts by type/status;
- tool latency and rejected cost limits.

## 15. Code-quality gates

Required:

- TypeScript strict mode;
- no unbounded `any` in application code;
- ESLint with import-boundary rules;
- Prettier or one formatter;
- package export maps;
- no circular dependencies;
- maximum module-size review threshold;
- complexity threshold for new functions;
- duplicate-code detection on CI or documented manual review;
- unused export detection;
- dependency audit;
- secret scan;
- contract snapshot validation.

Recommended thresholds:

```text
function complexity warning >= 10
module review warning >= 400 lines
component review warning >= 300 lines
API handler review warning >= 100 lines
```

Warnings require review; they are not an excuse to split cohesive logic into meaningless files.

## 16. Testing layers

### Unit

- schemas;
- error mapping;
- idempotency;
- rate limits;
- cookie policy;
- legal registry;
- CTA and route registries;
- safe redirect logic.

### Integration

- Nuxt API endpoints;
- middleware adapter fixtures;
- durable acceptance;
- privacy-request status tokens;
- cookie preference persistence;
- public config secret exclusion.

### Contract

- OpenAPI or generated API manifest;
- website event schemas;
- Odoo/n8n fixtures;
- problem responses;
- every form-to-endpoint mapping;
- every CTA target.

### Browser/accessibility

- all forms and states;
- cookie banner and settings;
- withdraw/change consent;
- legal pages;
- privacy request;
- English/Spanish behavior;
- keyboard and screen-reader behavior.

## 17. Migration path

Because the repository began as planning-only, implementation should start in the modular structure rather than creating a temporary root-level Nuxt app and moving it later.

If Codex finds application code already added by another branch:

1. inventory it;
2. preserve working behavior;
3. move modules in small commits;
4. keep route compatibility;
5. add temporary re-export adapters where required;
6. run tests after each move;
7. avoid combining architecture movement with unrelated feature changes.

## 18. Definition of done

Architecture cleanup is complete only when:

- the workspace structure exists;
- module boundaries are documented and linted;
- shared contracts are used by client and server;
- API handlers are thin;
- configuration is typed and centralized;
- public and secret settings are separated;
- route, form, CTA, legal, and API registries are machine validated;
- tests demonstrate boundary enforcement;
- no production behavior is changed by the architecture-only branch.
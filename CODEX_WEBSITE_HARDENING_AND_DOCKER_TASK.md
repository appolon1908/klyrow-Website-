# Codex Mission — Klyrow Website Hardening, APIs, Conversion and Docker

## Purpose

Improve the Klyrow public website implementation plan before application work begins. Build a clean, modern, production-grade Nuxt 4 website without turning one branch into an unreviewable monolith.

This mission supplements `CODEX_WEBSITE_PRODUCTION_TASK.md`. When the documents differ, this document controls branch separation, API readiness, form/CTA readiness and Docker runtime requirements.

## Non-negotiable architecture

```text
Browser
  -> Nuxt 4 SSR application
  -> same-origin versioned BFF APIs
  -> authenticated Codestra middleware
  -> durable middleware inbox/outbox
  -> Odoo CRM/contact/activity adapters
  -> optional non-authoritative n8n automation
```

- The browser never calls Odoo or n8n directly.
- The website never writes directly to Odoo PostgreSQL.
- n8n is not authoritative for leads, consent or customer state.
- The website must not expose middleware, Odoo, n8n, Postal or Keycloak credentials.
- The public website may collect interest and lead information; it must not activate live email delivery, create real invoices or change product entitlements.

## Clean branch model

The original broad scaffolds are superseded for new work:

```text
feat/nuxt4-marketing-site
feat/website-odoo-n8n-forms
feat/website-seo-performance
ops/caddy-production
release/website-production-readiness
```

Do not add implementation to those legacy scaffold branches. Use this sequence instead:

```text
planning/production-website-blueprint
  -> feat/site-shell-design-system
  -> feat/content-localization-pages
  -> feat/feature-pricing-conversion
  -> feat/public-api-bff
  -> feat/forms-conversion-engine
  -> feat/middleware-odoo-n8n
  -> feat/interactive-tools
  -> feat/seo-structured-data
  -> feat/analytics-consent
  -> perf/core-web-vitals-accessibility
  -> ops/docker-runtime
  -> ops/caddy-edge
  -> release/website-production-v1
```

Every branch must be recreated or updated from its latest reviewed prerequisites before implementation. Each branch gets one independently reviewable PR.

## Required product improvements

### 1. Stronger design and navigation

Build an original Klyrow design system with:

- large editorial headings and generous spacing;
- colorful blue/violet gradients with controlled cyan, coral, lime and amber accents;
- accessible light and dark storytelling sections;
- reusable shell, header, mega menus, mobile drawer, footer, CTA bands and cards;
- responsive behavior for narrow mobile, wide mobile, tablet, laptop and wide desktop;
- keyboard-complete menus, dialogs and forms;
- reduced-motion mode;
- no copied Apple assets, text, layout or interaction details.

### 2. Better conversion features

Add configuration-driven features that help visitors make a decision without inventing claims:

- plan comparison and pricing consultation flow;
- message-volume pricing estimator that shows estimates only when approved price configuration exists;
- domain and deliverability readiness checker using controlled DNS lookups only;
- API quick-start playground that calls a sandbox/mock endpoint only;
- migration consultation chooser;
- use-case selector for developer, marketing, agency/reseller, enterprise and Odoo/automation visitors;
- resource-download flow with explicit consent choices;
- meeting-scheduling handoff through an environment-configured approved provider or contact flow;
- website search across static content without shipping private data;
- status and documentation links driven by configuration.

Each heavy interactive tool belongs in `feat/interactive-tools` and must not block initial page rendering.

### 3. No dead calls to action

Create one typed CTA registry used by the header, hero sections, pricing cards, feature pages, popup, footer and landing pages.

Every CTA record must define:

```text
id
label_key
kind: route | form | external | download | auth
locale behavior
primary/secondary styling
analytics event
consent requirement
route or endpoint
allowed external host when applicable
```

Automated tests must fail when:

- a route CTA points to a missing route;
- a form CTA names an unregistered form;
- an external CTA uses an unapproved host;
- an auth CTA lacks an environment-configured destination;
- a download CTA points to a missing asset;
- localized labels are missing;
- a CTA is visually rendered as a button but has no action.

### 4. All forms ready end to end

Implement reusable forms for:

```text
request-demo
contact-sales
pricing-consultation
developer-interest
partner-application
support-contact
newsletter
migration-consultation
```

Every form requires:

- same-origin `/api/v1/...` endpoint;
- typed server-side validation;
- normalized email and phone fields;
- idempotency key;
- request and submission IDs;
- explicit service-contact consent and separate marketing consent;
- landing route, locale, referrer and approved UTM capture;
- origin/CSRF checks;
- body-size limit;
- IP/email rate limits;
- honeypot and minimum-completion-time checks;
- optional CAPTCHA adapter behind environment configuration;
- middleware durable-acceptance confirmation;
- accessible pending, success, duplicate, validation, rate-limited and retryable-failure states;
- no false success when middleware persistence fails;
- no sensitive values in logs or analytics.

### 5. Clean versioned API surface

Use the authoritative contract in `docs/API_FORM_CTA_CONTRACT.md`.

Required same-origin endpoints:

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

Rules:

- use `/api/v1` consistently;
- use RFC 7807-style `application/problem+json` errors;
- return stable machine-readable error codes;
- propagate `X-Request-ID`;
- accept `Idempotency-Key` for every externally visible write;
- return a stable `submission_id` or `operation_id`;
- never expose upstream implementation details or stack traces;
- document request/response examples;
- validate OpenAPI where generated;
- contract-test middleware requests and responses;
- use timeouts, bounded retries and circuit protection;
- do not retry non-idempotent upstream requests without a stable idempotency key.

### 6. Better failure behavior

Implement explicit states for:

```text
validation_error
rate_limited
duplicate_accepted
middleware_unavailable
middleware_rejected
captcha_required
captcha_failed
consent_required
configuration_unavailable
service_degraded
submission_accepted
```

The frontend must preserve non-sensitive entered values after retryable failures and move focus to the error summary.

### 7. Production Docker runtime

Implement the runtime defined in `docs/DOCKER_RUNTIME_AND_DEPLOYMENT.md`.

Required Docker properties:

- multi-stage build;
- Node 22 LTS build/runtime image pinned through the lock file and reviewed image policy;
- frozen pnpm install through Corepack;
- Nitro production output only in the runtime stage;
- non-root runtime user;
- no compiler, package manager cache or source-control metadata in runtime image;
- read-only filesystem where practical;
- writable `/tmp` through tmpfs;
- explicit healthcheck;
- graceful SIGTERM shutdown;
- runtime listens only on `127.0.0.1:3100` or an isolated Docker network;
- no secrets baked into image layers;
- environment validation on startup;
- image labels with repository and revision;
- container scan and SBOM;
- immutable SHA/digest deployment;
- resource limits and log rotation guidance.

Required artifacts:

```text
Dockerfile
.dockerignore
docker-compose.local.yml
docker-compose.staging.yml
docker-compose.production.yml or approved production compose fragment
scripts/docker-build.sh
scripts/docker-smoke.sh
scripts/deploy-staging.sh
scripts/deploy-production.sh
scripts/rollback-production.sh
```

Deployment scripts must be idempotent, validate prerequisites, preserve the previous release, and never restart unrelated services.

### 8. Caddy edge

Caddy remains the public edge:

```text
klyrow.com, www.klyrow.com
  -> Caddy HTTPS
  -> Docker/Nitro service on isolated loopback/network
```

Required behavior:

- `www` permanent redirect to apex;
- automatic HTTPS after DNS/port preflight;
- zstd/gzip compression;
- immutable caching for hashed assets;
- no long cache for HTML or API responses;
- security headers;
- request ID forwarding;
- body-size limits for forms;
- privacy-safe access logs and rotation;
- health check before reload;
- complete Caddy backup and `caddy validate` before reload;
- no edits to unrelated site blocks.

### 9. SEO, analytics and performance

Keep SEO, consent tracking and performance in separate branches.

- `feat/seo-structured-data`: metadata, canonical, hreflang, sitemaps, robots, structured data, link validation.
- `feat/analytics-consent`: consent manager, GTM/GA4 abstraction, event dictionary, attribution, privacy checks.
- `perf/core-web-vitals-accessibility`: image/font optimization, bundle budgets, Lighthouse CI, Playwright device matrix and WCAG 2.2 AA fixes.

Do not hide performance problems inside a general SEO PR.

## Branch responsibilities

### `feat/site-shell-design-system`

Nuxt scaffold, design tokens, components, navigation, footer, dialogs, CTA primitives and base tests.

### `feat/content-localization-pages`

Data-driven English/Spanish content system, all route templates, localized navigation/content and route-manifest tests.

### `feat/feature-pricing-conversion`

Five audience landings, 21 feature pages, pricing, comparison, conversion sections, CTA registry and pricing configuration behavior.

### `feat/public-api-bff`

Same-origin API framework, common validation, errors, request IDs, idempotency, origin/CSRF, rate-limit interfaces, health/readiness and contract tests.

### `feat/forms-conversion-engine`

All form components, schemas, pending/success/failure UX, anti-abuse controls, CTA-to-form registration and browser tests. Uses a mocked middleware adapter until the next branch.

### `feat/middleware-odoo-n8n`

Durable middleware client, event schemas, Odoo/n8n mappings, test-mode verification, retry/dead-letter visibility and operational metrics. No browser direct integration.

### `feat/interactive-tools`

Pricing estimate, DNS/domain readiness, sandbox API playground, migration chooser, content search and scheduling handoff. All tools require bounded cost and abuse controls.

### `feat/seo-structured-data`

SEO metadata, canonical/hreflang, sitemaps, robots, structured data and crawl/link tests.

### `feat/analytics-consent`

Consent-aware analytics, attribution, event validation and privacy tests.

### `perf/core-web-vitals-accessibility`

Performance/accessibility remediation, device browser matrix, Lighthouse budgets and reviewed exceptions.

### `ops/docker-runtime`

Dockerfiles, compose, environment validation, health/readiness, immutable images, scans, SBOM and deployment scripts. Staging only.

### `ops/caddy-edge`

Caddy site fragment, staging edge, security/cache/logging behavior, backup/validate/reload/rollback scripts. No public activation.

### `release/website-production-v1`

Integrate reviewed branches, certify staging, verify DNS/TLS/forms/SEO/performance/rollback and activate only the public website after every gate passes.

## Required CI matrix

Each applicable branch must add or preserve:

```text
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
route-manifest validation
CTA registry validation
API contract tests
form browser tests
Playwright device tests
axe accessibility tests
Lighthouse CI
broken-link checks
metadata/hreflang/sitemap checks
secret scan
dependency audit
Docker build
container scan
SBOM
```

No pull-request workflow deploys production.

## Production authorization

Codex may deploy the public website only from `release/website-production-v1` after all required branches are reviewed and integrated and after exact staging, middleware, Odoo/n8n test-mode, DNS, Caddy, TLS, performance, accessibility, security and rollback evidence passes.

Codex must stop on missing DNS, host access, production environment values, middleware credentials, approved Odoo mapping, n8n workflow IDs, analytics IDs or owner-approved prices. It must not invent them.

## Required completion report per branch

Report:

1. repository, directory, branch, starting SHA and final SHA;
2. all commits and changed files;
3. requirements marked implemented, partial, missing or blocked;
4. APIs/routes/components/features added;
5. CTA registry and form registry coverage;
6. exact tests and results;
7. build and bundle results;
8. browser/accessibility/performance evidence;
9. API/middleware contract evidence where applicable;
10. Docker/container evidence where applicable;
11. security, dependency and secret-scan evidence;
12. rollback notes;
13. blockers and limitations;
14. confirmation that production was not changed except in the authorized release branch;
15. confirmation that live email delivery, Postal and real billing were not changed.

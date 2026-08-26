# Codex Production Mission — Klyrow Public Website V2

## Mission

Build, test and deploy the public Klyrow website:

```text
https://klyrow.com
https://www.klyrow.com -> permanent redirect to https://klyrow.com
```

Repository:

```text
https://github.com/appolon1908-hue/klyrow-Website-
```

The repository began empty. Build the application from the contracts in `planning/production-website-blueprint`.

The owner authorizes production activation of the **public website only** after every required branch, review, CI, staging, integration, Docker, Caddy, DNS, TLS and rollback gate passes. This does not authorize live email-delivery changes, Postal changes, real billing, Odoo accounting changes, unrestricted n8n activation, Keycloak changes or changes to unrelated production applications.

## Authoritative reading order

Read completely before editing:

1. `CODEX_WEBSITE_PRODUCTION_TASK.md`
2. `CODEX_WEBSITE_HARDENING_AND_DOCKER_TASK.md`
3. `docs/BRANCH_AND_DELIVERY_PLAN.md`
4. `docs/API_FORM_CTA_CONTRACT.md`
5. `docs/ENHANCED_FEATURES_AND_BRANCHES.md`
6. `docs/DOCKER_RUNTIME_AND_DEPLOYMENT.md`
7. `docs/SITEMAP_CONTENT_AND_DESIGN.md`
8. `docs/FORMS_MIDDLEWARE_ODOO_N8N.md`
9. `docs/SEO_PERFORMANCE_AND_TRACKING.md`
10. `docs/CADDY_PRODUCTION_DEPLOYMENT.md`
11. the active branch's `CODEX_BRANCH_TASK.md`.

Before changing code, inventory every applicable requirement as:

```text
IMPLEMENTED
PARTIAL
MISSING
BLOCKED
NOT_APPLICABLE
```

## Superseded broad branches

Do not implement on these old broad scaffolds:

```text
feat/nuxt4-marketing-site
feat/website-odoo-n8n-forms
feat/website-seo-performance
ops/caddy-production
release/website-production-readiness
```

They are retained for history only.

## Clean implementation sequence

Use exactly:

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

Before implementing each branch, recreate or update it from the latest accepted prerequisites. One independently reviewable PR per branch. Push the branch, post exact evidence and stop before the next branch unless explicitly instructed to continue from an accepted baseline.

## Technology baseline

Use:

- Nuxt 4, Vue 3 and TypeScript;
- Node.js 22 active LTS or a later supported active LTS;
- pnpm through Corepack with committed `pnpm-lock.yaml`;
- Nitro SSR and route-level prerendering;
- same-origin versioned Nuxt server APIs;
- Vitest/Nuxt test utilities;
- Playwright;
- axe accessibility checks;
- Lighthouse CI;
- multi-stage Docker runtime;
- Caddy as the production TLS reverse proxy;
- Codestra middleware as the only boundary to Odoo and n8n.

Do not use Nuxt 3. Do not build a client-only SPA for indexable content.

## Product scope

Implement:

- 46 unique English indexable content pages;
- 46 complete Spanish equivalents under `/es`;
- 92 localized indexable URLs;
- four legal/policy pages per locale;
- noindex form-confirmation and error routes;
- five audience landing experiences:
  - developers;
  - marketing teams;
  - agencies/resellers;
  - enterprise;
  - Odoo and automation teams;
- 21 dedicated feature pages;
- pricing and plan comparison;
- `Contact sales` mode until owner-approved prices exist;
- demo, sales, pricing, developer, partner, migration, support and newsletter forms;
- pricing estimator when approved pricing configuration exists;
- DNS-only domain readiness tool;
- no-side-effect API sandbox;
- migration chooser, content search and scheduling handoff;
- English and Spanish navigation/content/forms;
- mobile, tablet, laptop and wide-desktop layouts.

Create an original, colorful, spacious Klyrow design inspired by premium editorial technology sites without copying Apple code, assets, wording, trademarks or distinctive page compositions.

Do not ship fake customer logos, testimonials, prices, reviews, ratings, certifications, awards, guarantees or performance statistics.

## CTA readiness

Use one typed CTA registry for every header, hero, section, pricing card, popup and footer action.

Every CTA must resolve to one of:

```text
route
registered form
authorized external URL
existing download
environment-configured auth URL
```

CI must fail on empty, placeholder, missing, unlocalized or unsafe CTA targets. No production CTA may use `#`, `javascript:void(0)` or an unconfigured placeholder.

Follow `docs/API_FORM_CTA_CONTRACT.md`.

## API readiness

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

API rules:

- `/api/v1` versioning;
- typed server-side validation;
- RFC 7807-style `application/problem+json` errors;
- stable machine-readable error codes;
- `X-Request-ID` propagation;
- `Idempotency-Key` for externally visible writes;
- stable submission/operation IDs;
- origin/CSRF controls;
- body, cost and rate limits;
- safe redirect allowlist;
- bounded middleware timeouts/retries;
- no upstream stack traces or credentials;
- request/response examples and contract tests.

## Forms and back-office boundary

Required flow:

```text
Browser
  -> Nuxt same-origin /api/v1 endpoint
  -> authenticated Codestra middleware
  -> durable middleware inbox/outbox
  -> Odoo 19 CRM/contact/activity/support adapter
  -> optional non-authoritative n8n automation
```

Every form requires:

- typed schema and normalization;
- idempotency and request/submission/event IDs;
- service-contact and marketing-consent separation;
- source, locale, referrer and approved UTM capture;
- origin/CSRF and body-size controls;
- IP/email rate limits;
- honeypot and minimum-completion-time controls;
- optional CAPTCHA adapter;
- durable middleware-acceptance confirmation;
- accessible pending, success, duplicate, validation, rate-limited and retryable-failure states;
- preserved non-sensitive values on retryable failure;
- no false success when durable persistence fails;
- no sensitive form bodies in logs or analytics.

Never expose or commit Odoo, n8n, middleware, Postal or Keycloak credentials. Never call Odoo or n8n directly from the browser. Never write directly to Odoo PostgreSQL. n8n is not authoritative.

## Interactive tools safety

- Pricing estimate uses only approved configuration and is non-binding.
- Domain readiness accepts a normalized domain and performs controlled DNS queries only.
- No arbitrary URL fetch or internal/private network probing.
- API sandbox uses fixtures or an approved test service and never sends real email.
- Tools use strict timeout, rate, body and resource limits.
- Tools are lazy loaded and must not degrade the initial route.

## SEO and Google acceptance

Implement:

- meaningful SSR/prerendered HTML;
- unique title, description and social metadata;
- canonical URLs;
- reciprocal English/Spanish hreflang plus `x-default`;
- sitemap index and locale sitemaps;
- robots.txt;
- real 404 behavior;
- crawlable ordinary links;
- accurate Organization and WebSite JSON-LD;
- BreadcrumbList on hierarchical pages;
- page schema only when visible content supports it;
- Search Console verification through environment configuration;
- broken-link, metadata, sitemap and structured-data tests;
- no keyword stuffing, hidden text, doorway pages or thin duplicated pages.

Meeting technical requirements does not guarantee Google indexing, ranking or rich results. Report measured facts only.

## Tracking

Create a consent-aware analytics abstraction. GTM/GA4 is optional and environment configured.

Approved event families include:

```text
page_view
cta_click
pricing_cta_click
form_start
form_validation_error
form_submit
form_submit_success
form_submit_failure
language_change
resource_download
popup_view
popup_submit
tool_start
tool_complete
tool_failure
```

Never send passwords, complete phone numbers, form message bodies, API keys, CAPTCHA tokens or credentials to analytics. Do not load optional marketing analytics before consent when policy requires consent.

## Performance and accessibility

Target Core Web Vitals good thresholds:

```text
LCP <= 2.5 seconds
INP <= 200 milliseconds
CLS <= 0.1
```

Lighthouse CI mobile minimums on home, pricing, one solution and one feature page:

```text
Performance >= 95
Accessibility = 100
Best Practices >= 95
SEO = 100
```

Budgets:

```text
Initial compressed JavaScript <= 180 KB
Initial compressed CSS <= 70 KB
Critical font transfer <= 100 KB
No single above-fold raster image > 180 KB
No third-party analytics JavaScript before consent
```

Meet WCAG 2.2 AA: skip link, keyboard-complete navigation, logical headings, labels/descriptions, visible focus, contrast, reduced motion, dialog focus management, live form status, 200% zoom and mobile touch targets.

Do not claim a Lighthouse/PageSpeed score that was not measured. Record failures and reviewed exceptions honestly.

## Security

Implement:

- strict validation and output encoding;
- CSRF/origin controls;
- rate/body/resource limits;
- safe redirect allowlist;
- CSP/security headers;
- no arbitrary URL fetching or open proxy;
- secret files/approved secret manager only;
- dependency, image and secret scans;
- non-root read-only Docker runtime where practical;
- privacy-safe logs;
- no sensitive form bodies or credentials in logs.

## Docker runtime

Follow `docs/DOCKER_RUNTIME_AND_DEPLOYMENT.md`.

Required:

- multi-stage Dockerfile;
- frozen pnpm build;
- Nitro-only non-root runtime;
- read-only root filesystem and tmpfs where practical;
- healthcheck and graceful SIGTERM;
- no secrets baked into image;
- local/staging/production compose;
- immutable SHA/digest images;
- container scan, SBOM and provenance where available;
- staging deployment/rollback scripts;
- public production deployment only from the release branch.

## CI/CD

Required applicable checks:

1. frozen lock-file install;
2. type check;
3. lint;
4. unit/component tests;
5. Nuxt build and prerender validation;
6. route and localized-content validation;
7. CTA registry validation;
8. API/form contract tests;
9. Playwright browser/device tests;
10. axe accessibility tests;
11. Lighthouse CI;
12. link/metadata/hreflang/sitemap/structured-data checks;
13. secret scan;
14. dependency audit;
15. Docker build;
16. container scan;
17. SBOM;
18. immutable artifact publication only from an explicitly dispatched release workflow.

No pull-request workflow may deploy production.

## Production host and topology

Preferred host to audit:

```text
Codestra middleware/Caddy server
public IP: 65.109.65.169
private IP: 10.40.0.1
```

Preferred runtime:

```text
Caddy :80/:443
  -> loopback/private Docker upstream :3100
  -> Nuxt/Nitro
  -> same-origin server APIs
  -> authenticated middleware
```

Use `/srv/codex-workspaces/klyrow-Website-` for implementation. Do not develop in the live release path, `/var/www`, `/opt/klyrow` or another production checkout.

## Production gates

Only `release/website-production-v1` may activate the public site after:

```text
REVIEWED_FEATURE_PRS=PASS
CI=PASS
CTA_REGISTRY=PASS
FORM_REGISTRY=PASS
API_CONTRACTS=PASS
STAGING=PASS
ROUTE_AND_LOCALE_COUNTS=PASS
MOBILE_AND_DESKTOP=PASS
ACCESSIBILITY=PASS
SEO_VALIDATION=PASS
LIGHTHOUSE=PASS_OR_REVIEWED_EXCEPTION
MIDDLEWARE_DURABILITY=PASS
ODOO_TEST_OR_APPROVED_ROUTE=PASS
N8N_TEST_OR_APPROVED_ROUTE=PASS
DOCKER_SECURITY=PASS
IMAGE_SCAN=PASS
SBOM=PRESENT
DNS=PASS
CADDY_BACKUP=PASS
CADDY_VALIDATE=PASS
TLS=PASS
HEALTH_AND_READINESS=PASS
ROLLBACK_REHEARSAL=PASS
UNRELATED_SERVICES_UNCHANGED=PASS
```

DNS for `klyrow.com` and `www.klyrow.com` must resolve to the intended Caddy host and ports 80/443 must be reachable. Back up and validate the complete existing Caddy configuration. Add/update only the Klyrow website fragment. Do not restart the complete middleware stack.

If DNS, host access, middleware credentials, Odoo mappings, n8n identifiers, Search Console authorization, approved prices or production secrets are missing, report the exact blocker. Do not invent or bypass it.

## Required branch completion report

For every branch provide:

1. hostname/IPs where applicable;
2. isolated working directory and repository remote;
3. branch starting/final SHAs;
4. commits and changed files;
5. requirements status;
6. routes/components/APIs/forms/CTAs/features added;
7. exact type-check/lint/test/build results;
8. route/CTA/form/API contract evidence;
9. browser/accessibility/performance evidence;
10. middleware/Odoo/n8n test evidence where applicable;
11. Docker/image/SBOM evidence where applicable;
12. security/dependency/secret-scan results;
13. rollback notes;
14. blockers/limitations;
15. confirmation that production was not changed outside the authorized release branch;
16. confirmation that live email delivery, Postal and real billing were not changed.

Do not mark complete merely because the site builds.
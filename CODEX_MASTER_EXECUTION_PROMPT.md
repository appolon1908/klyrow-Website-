# Master Codex Execution Prompt — Klyrow Website V2

Repository:

```text
https://github.com/appolon1908-hue/klyrow-Website-
```

Planning branch:

```text
planning/production-website-blueprint
```

Execution tracker:

```text
https://github.com/appolon1908-hue/klyrow-Website-/issues/3
```

## Instructions

You are implementing the Klyrow public website. The repository began as a planning-only project. Do not report application functionality that does not exist in code and tests.

Read completely:

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

## Mandatory branch order

Execute one branch at a time:

```text
PR #4  feat/site-shell-design-system
PR #5  feat/content-localization-pages
PR #6  feat/feature-pricing-conversion
PR #7  feat/public-api-bff
PR #8  feat/forms-conversion-engine
PR #9  feat/middleware-odoo-n8n
PR #10 feat/interactive-tools
PR #11 feat/seo-structured-data
PR #12 feat/analytics-consent
PR #13 perf/core-web-vitals-accessibility
PR #14 ops/docker-runtime
PR #15 ops/caddy-edge
PR #16 release/website-production-v1
```

Do not implement on the superseded broad branches.

Before each branch:

1. print hostname and IPs when on a server;
2. print current directory;
3. print repository remote;
4. print current branch;
5. print starting SHA;
6. print git status;
7. identify accepted prerequisite SHAs;
8. update/recreate the branch from those prerequisites;
9. read the active `CODEX_BRANCH_TASK.md`;
10. inventory requirements as `IMPLEMENTED`, `PARTIAL`, `MISSING`, `BLOCKED` or `NOT_APPLICABLE`.

Then:

1. implement only the active branch mission;
2. use logical commits;
3. run exact targeted and complete checks;
4. push only the active branch;
5. update the matching draft PR with evidence;
6. stop before starting the next branch.

## Architecture

```text
Browser
  -> Nuxt 4 SSR
  -> same-origin /api/v1 BFF
  -> Codestra middleware
  -> durable inbox/outbox
  -> Odoo CRM/contact/activity/support
  -> optional non-authoritative n8n automation
```

Never call Odoo or n8n directly from the browser. Never write directly to Odoo PostgreSQL. Never expose or commit middleware, Odoo, n8n, Postal, Keycloak, CAPTCHA, analytics or TLS secrets.

## API and conversion requirements

- Use the endpoint registry in `docs/API_FORM_CTA_CONTRACT.md`.
- Use RFC 7807-style problems.
- Propagate request IDs.
- Require idempotency for writes.
- Validate origin/CSRF, body limits and rate limits.
- Validate every CTA, route, form, external host and download in CI.
- No production CTA may be empty, `#`, placeholder or `javascript:void(0)`.
- Show form success only after durable acceptance.
- Preserve non-sensitive form values after retryable failure.
- Never log or track sensitive form bodies.

## Docker branch instructions

On PR #14:

- build a multi-stage Dockerfile;
- use frozen pnpm and Nitro output only;
- run non-root;
- use read-only filesystem and tmpfs where practical;
- implement health/readiness and graceful shutdown;
- create local/staging/production compose definitions;
- publish immutable image SHA/digest only through explicit release workflow;
- scan dependencies and image;
- generate SBOM;
- deploy and roll back staging only;
- do not switch public production traffic.

## Caddy branch instructions

On PR #15:

- audit the real Caddy environment;
- back up the complete configuration;
- add only the Klyrow site fragment;
- configure apex/`www`, HTTPS, compression, caching, security headers, body limits and privacy-safe logs;
- validate before reload;
- reload Caddy only;
- rehearse rollback in staging;
- do not activate public production.

## Production branch instructions

On PR #16, only after every prerequisite is reviewed and integrated:

- record exact release SHA and image digest;
- run full CI, route, CTA, form, API, integration, SEO, accessibility, Lighthouse and container certification;
- deploy staging and rehearse rollback;
- verify durable middleware plus approved Odoo/n8n test-mode results;
- verify DNS, TLS, Caddy and health;
- deploy only the public website;
- monitor and roll back on any stop condition;
- preserve previous release;
- provide the complete final report.

This does not authorize live email delivery, Postal changes, real billing, Odoo accounting mutations, unrestricted n8n activation, Keycloak changes or unrelated service changes.

## Completion report for every branch

Report:

1. repository/directory/branch;
2. starting/final SHA;
3. commits and changed files;
4. implemented/retained/deferred/blocked work;
5. routes/components/APIs/forms/CTAs/tools added;
6. exact type/lint/test/build commands and results;
7. browser/accessibility/performance results;
8. API/middleware/Odoo/n8n contract evidence where applicable;
9. Docker/image/scan/SBOM evidence where applicable;
10. security/dependency/secret-scan results;
11. rollback notes;
12. limitations/blockers;
13. confirmation that production was not changed outside PR #16;
14. confirmation that live email delivery, Postal, real billing and unrelated services were unchanged.

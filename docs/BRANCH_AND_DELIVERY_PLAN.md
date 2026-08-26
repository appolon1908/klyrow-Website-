# Klyrow Website — Branch and Delivery Plan

## Objective

Build the Klyrow public website through small, reviewable branches while keeping architecture cleanup, legal/privacy behavior, heavy interactive work, infrastructure, and production activation isolated.

The presence of a branch or pull request means only that a workspace exists. Use `docs/IMPLEMENTATION_STATUS_AND_RELEASE_TRUTH.md` for status language.

## Authoritative planning documents

Read before implementation:

1. `CODEX_WEBSITE_PRODUCTION_TASK.md`
2. `CODEX_WEBSITE_HARDENING_AND_DOCKER_TASK.md`
3. `docs/IMPLEMENTATION_STATUS_AND_RELEASE_TRUTH.md`
4. `docs/REPOSITORY_ARCHITECTURE_AND_API_CATALOG.md`
5. `docs/API_FORM_CTA_CONTRACT.md`
6. `docs/LEGAL_PRIVACY_COOKIE_COMPLIANCE.md`
7. `docs/ENHANCED_FEATURES_AND_BRANCHES.md`
8. `docs/DOCKER_RUNTIME_AND_DEPLOYMENT.md`
9. `docs/SITEMAP_CONTENT_AND_DESIGN.md`
10. `docs/FORMS_MIDDLEWARE_ODOO_N8N.md`
11. `docs/SEO_PERFORMANCE_AND_TRACKING.md`
12. `docs/CADDY_PRODUCTION_DEPLOYMENT.md`

When an older document conflicts with the modular architecture, API catalog, legal/privacy contract, or this branch plan, the newer focused contract controls.

## Superseded broad scaffolds

Do not implement on:

```text
feat/nuxt4-marketing-site
feat/website-odoo-n8n-forms
feat/website-seo-performance
ops/caddy-production
release/website-production-readiness
```

They remain for history only.

## Authoritative 15-branch sequence

```text
planning/production-website-blueprint
  -> refactor/modular-website-architecture
  -> feat/site-shell-design-system
  -> feat/content-localization-pages
  -> feat/feature-pricing-conversion
  -> feat/public-api-bff
  -> feat/legal-privacy-cookie-center
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

Before implementation, each branch must be updated or recreated from its latest accepted prerequisites. Scaffold SHAs are not implementation baselines.

## 1. `planning/production-website-blueprint`

Documentation and contracts only:

- product/page inventory;
- architecture and module boundaries;
- API/form/CTA contracts;
- legal/privacy/cookie requirements;
- SEO, analytics, performance, accessibility, Docker, Caddy, release, and rollback requirements;
- branch tasks and acceptance evidence.

No application code or production deployment from this branch.

## 2. `refactor/modular-website-architecture`

Objective: create a clean implementation foundation before features are added.

Required:

- pnpm workspace;
- `apps/web` Nuxt application boundary;
- shared `packages/contracts`, content schema, i18n, analytics contracts, test utilities, and lint configuration;
- typed centralized environment/configuration layer;
- client/server import boundaries;
- path aliases and export maps;
- strict TypeScript;
- lint/format/test/build foundations;
- route, form, CTA, API, and legal registry interfaces;
- module-boundary tests;
- no user-facing feature expansion.

Must not add bulk pages, live forms, integrations, Docker/Caddy deployment, or production changes.

## 3. `feat/site-shell-design-system`

Prerequisite: accepted modular architecture.

Required:

- Nuxt 4/Vue 3 application shell;
- design tokens and reusable components;
- responsive header, mega menus, mobile navigation, footer, breadcrumbs, dialogs, alerts, toasts, and error boundaries;
- localization framework;
- CTA primitive consuming the typed registry;
- foundational unit/component/browser/accessibility tests.

No bulk content, real forms/APIs, integrations, analytics, Docker, Caddy, or deployment.

## 4. `feat/content-localization-pages`

Prerequisites: accepted architecture and shell.

Required:

- typed content system;
- 46 English marketing pages;
- 46 complete Spanish marketing equivalents;
- localized navigation/footer/breadcrumbs;
- legal-document rendering template, but not final legal/cookie behavior;
- utility/error routes;
- route manifest;
- content completeness, translation, relationship, and link tests.

No live forms, integrations, analytics, Docker, Caddy, or deployment.

## 5. `feat/feature-pricing-conversion`

Prerequisites: accepted shell and content.

Required:

- five audience landing experiences;
- 21 feature pages;
- pricing and plan comparison;
- approved-value configuration only;
- use-case selector;
- conversion bands;
- popup/announcement behavior;
- environment-driven sign-in/docs/status/scheduling links;
- typed CTA registry and dead-action tests.

No real form submission, middleware/Odoo/n8n, analytics loader, Docker, Caddy, or deployment.

## 6. `feat/public-api-bff`

Prerequisites: accepted architecture and shell.

Required:

- clean `/api/v1` route structure;
- shared request context and request IDs;
- typed shared schemas;
- success and RFC 7807 problem responses;
- idempotency;
- CSRF/origin, rate/body/cost limits;
- safe redirects;
- typed public configuration;
- health/readiness;
- public content/legal metadata APIs;
- consent, form, privacy, legal-update, abuse/security, and tool API contracts;
- mocked durable middleware adapter;
- OpenAPI/API manifest and contract tests.

No final form UI, production middleware credentials, direct Odoo/n8n access, Docker, Caddy, or deployment.

## 7. `feat/legal-privacy-cookie-center`

Prerequisites: accepted architecture, shell, content, and BFF.

Required:

- bilingual typed legal-document registry;
- legal hub;
- privacy, terms, acceptable use, cookies, anti-spam, DPA, subprocessors, security disclosure, accessibility, service/support, and copyright/trademark pages;
- cookie settings and privacy-request utilities;
- conditional legal templates;
- draft/review/approved/retired publication state;
- legal version/effective-date metadata;
- typed cookie/storage registry;
- accept all, reject non-essential, customize, withdraw, and change behavior;
- single consent/script gate;
- GPC/applicability support;
- privacy, DPA, update, abuse, and security forms using mocked durable APIs;
- noindex/index/sitemap rules;
- browser, accessibility, security, and consent-network tests;
- clear counsel-approval release gate.

This branch does not enable GTM/GA4; the analytics branch must consume this consent service rather than create a competing store.

## 8. `feat/forms-conversion-engine`

Prerequisites: accepted conversion, BFF, and legal/privacy foundations.

Required:

- request demo;
- contact sales;
- pricing consultation;
- developer interest;
- partner application;
- migration consultation;
- support contact;
- newsletter;
- DPA/security/privacy-related forms that belong to shared form infrastructure;
- server/client shared validation;
- normalization, consent separation, attribution, idempotency, anti-abuse, accessible states, and CTA wiring;
- mocked durable middleware outcomes;
- browser/accessibility tests.

No direct Odoo/n8n access, production middleware credentials, Docker, Caddy, or deployment.

## 9. `feat/middleware-odoo-n8n`

Prerequisites: accepted BFF, forms, and legal/privacy contracts.

Required:

- authenticated Codestra middleware client;
- durable acceptance validation;
- request/event/correlation propagation;
- bounded retry and circuit behavior;
- website lead, consent, privacy, legal-update, abuse, and security event schemas;
- Odoo CRM/contact/activity/helpdesk/privacy-case mappings;
- non-authoritative n8n routing, notifications, reminders, and escalation contracts;
- dead-letter/reconciliation guidance;
- metrics and privacy-safe logs;
- test-mode evidence.

No browser direct Odoo/n8n calls, direct Odoo database access, real accounting/billing, live email sending, Docker, Caddy, or deployment.

## 10. `feat/interactive-tools`

Prerequisites: accepted conversion, BFF, and forms.

Required:

- configuration-driven pricing estimator;
- DNS-only domain readiness checker;
- no-side-effect API sandbox;
- migration chooser;
- static public-content search;
- approved scheduling handoff;
- lazy loading, strict limits, security tests, and accessible UI.

No real email, billing, arbitrary URL fetch, private-network probe, direct Odoo/n8n access, Docker, Caddy, or deployment.

## 11. `feat/seo-structured-data`

Prerequisites: accepted content, conversion, and legal/privacy pages.

Required:

- unique metadata;
- canonical and reciprocal hreflang;
- marketing and legal route sitemap rules;
- draft/noindex legal behavior;
- robots;
- real 404/noindex utility behavior;
- accurate structured data;
- internal linking;
- automated route, link, metadata, sitemap, and schema validation.

No analytics loader, invented proof/ratings/prices, Docker, Caddy, or deployment.

## 12. `feat/analytics-consent`

Prerequisites: accepted conversion, forms, and legal/privacy cookie center.

Required:

- consume the existing consent state and category gate;
- optional environment-configured GTM/GA4 adapter;
- typed event dictionary;
- CTA/form/tool attribution;
- UTM normalization;
- test-traffic labeling;
- sensitive-payload filters;
- proof that optional analytics does not load before permission in strict mode.

No separate cookie-consent store, raw form tracking, direct Odoo/n8n changes, Docker, Caddy, or deployment.

## 13. `perf/core-web-vitals-accessibility`

Prerequisites: all selected user-facing branches accepted.

Required:

- measure/remediate bundles, images, fonts, hydration, lazy loading, and third parties;
- Core Web Vitals instrumentation;
- Playwright device matrix;
- axe and manual keyboard behavior;
- legal/cookie/privacy flow accessibility;
- 200% zoom;
- WCAG 2.2 AA;
- exact Lighthouse and budget evidence.

No unrelated feature expansion, disabled audits, fabricated scores, Docker, Caddy, or deployment.

## 14. `ops/docker-runtime`

Prerequisites: accepted application and performance branches.

Required:

- multi-stage non-root Dockerfile;
- `.dockerignore`;
- local/staging/production compose;
- typed environment validation;
- read-only runtime/tmpfs where practical;
- health/readiness and graceful shutdown;
- immutable SHA/digest publication;
- image scan, SBOM, provenance where supported;
- staging deploy, smoke, verify, and rollback scripts.

No public production switch, mutable `latest` deployment, source mount in production, Docker-daemon restart, Caddy activation, or unrelated changes.

## 15. `ops/caddy-edge`

Prerequisite: accepted Docker runtime.

Required:

- audit real Caddy environment;
- back up complete config;
- add only Klyrow site fragment;
- apex/`www` behavior;
- HTTPS, compression, caching, security headers, body limits, privacy-safe logs;
- validate/reload/rollback scripts;
- staging edge verification.

No public activation, DNS mutation, full stack restart, unrelated site edit, TLS private-key commit, or product-service mutation.

## 16. `release/website-production-v1`

Prerequisite: all selected feature, performance, Docker, and Caddy PRs independently reviewed and accepted.

Responsibilities:

- integrate exact reviewed SHAs;
- immutable release artifact/digest;
- full route/locale/CTA/form/API/legal/consent/integration/SEO/analytics/accessibility/performance/container/Caddy certification;
- staging deployment;
- middleware/Odoo/n8n approved test routing;
- DNS/TLS preflight;
- rollback rehearsal;
- public website deployment;
- post-deploy verification;
- prior release retention;
- final evidence report.

Only this branch may activate the public website.

## Pull-request requirements

Every PR includes:

1. exact scope and prerequisite SHAs;
2. current status using the approved status vocabulary;
3. implementation;
4. exact tests and results;
5. API/route/form/CTA/legal registry changes;
6. security/privacy impact;
7. accessibility impact;
8. performance impact;
9. screenshots/browser evidence where applicable;
10. operational impact;
11. rollback notes;
12. known limitations/blockers;
13. confirmation that production was not changed unless this is the authorized release PR.

## Commit rules

- logical commits;
- no force-push after review begins;
- no unrelated history rewrite;
- committed `pnpm-lock.yaml`;
- no `.env`, credentials, analytics secrets, Odoo/middleware/n8n keys, or TLS private keys;
- no mutable build output committed to feature branches;
- no application module that violates the dependency boundaries in `docs/REPOSITORY_ARCHITECTURE_AND_API_CATALOG.md`.

## Current program status

```text
PLANNING=AVAILABLE
BRANCH_TASKS=BEING_PREPARED
APPLICATION=NOT_COMPLETE
STAGING=NOT_ACTIVE
PRODUCTION=NOT_ACTIVE
LIVE=NO
```
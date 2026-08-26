# Klyrow Website — Branch and Delivery Plan

## Objective

Build the public Klyrow website through focused, independently reviewable branches. Keep design, content, APIs, forms, integrations, tools, SEO, analytics, performance, Docker and Caddy concerns separate.

## Authoritative reading

Codex must read:

1. `CODEX_WEBSITE_PRODUCTION_TASK.md`
2. `CODEX_WEBSITE_HARDENING_AND_DOCKER_TASK.md`
3. `docs/API_FORM_CTA_CONTRACT.md`
4. `docs/ENHANCED_FEATURES_AND_BRANCHES.md`
5. `docs/DOCKER_RUNTIME_AND_DEPLOYMENT.md`
6. the original sitemap, forms, SEO and Caddy documents;
7. the active branch's `CODEX_BRANCH_TASK.md`.

## Superseded broad scaffolds

The following early scaffolds must not receive new implementation:

```text
feat/nuxt4-marketing-site
feat/website-odoo-n8n-forms
feat/website-seo-performance
ops/caddy-production
release/website-production-readiness
```

They are retained only for history and are replaced by the focused branches below.

## Authoritative branch sequence

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

This list is a dependency order, not permission to merge without review. Before implementation, update each branch from its latest accepted prerequisites.

## 1. `planning/production-website-blueprint`

Documentation and contracts only:

- route and content inventory;
- design requirements;
- frontend/backend boundary;
- CTA/form/API registry;
- middleware/Odoo/n8n contracts;
- SEO/tracking/performance requirements;
- Docker runtime;
- Caddy deployment and rollback;
- branch tasks and acceptance evidence.

No application code deploys from this branch.

## 2. `feat/site-shell-design-system`

Required implementation:

- Nuxt 4, Vue 3 and TypeScript scaffold;
- Node/pnpm baseline and committed lock file;
- original Klyrow design tokens;
- typography, spacing, surfaces and responsive grid;
- accessible header, mega menus, mobile drawer and footer;
- reusable button/link/input/select/textarea/checkbox/radio/card/accordion/tab/dialog/toast components;
- CTA rendering primitive backed by typed definitions;
- English/Spanish localization framework;
- base error, loading, empty and offline states;
- unit/component/keyboard/accessibility tests.

Excludes bulk page content, forms, server APIs, middleware, SEO, analytics and Docker.

## 3. `feat/content-localization-pages`

Prerequisite: accepted shell/design system.

Required implementation:

- data-driven page content schema;
- 46 English indexable pages;
- 46 complete Spanish equivalents;
- legal and utility routes;
- localized navigation, footer and breadcrumbs;
- route manifest and localized completeness tests;
- crawlable links between related content;
- no thin, duplicated or placeholder translations.

## 4. `feat/feature-pricing-conversion`

Prerequisites: accepted shell and content branches.

Required implementation:

- five audience landing experiences;
- 21 dedicated feature pages;
- pricing and plan comparison;
- approved-configuration pricing behavior;
- contact-sales fallback when price values are absent;
- CTA registry and all global/contextual CTAs;
- accessible popup and announcement behavior;
- automated route/form/external/download/auth CTA checks;
- no placeholders, fake proof or fabricated commercial claims.

## 5. `feat/public-api-bff`

May proceed in parallel after the shell contract is stable.

Required implementation:

- same-origin `/api/v1` server framework;
- public configuration endpoint;
- health/readiness endpoints;
- common validation and response types;
- RFC 7807-style problem responses;
- request-ID propagation;
- idempotency interface;
- CSRF/origin controls;
- request body limits;
- rate-limit abstraction;
- safe redirects;
- API docs and contract tests;
- mocked middleware adapter.

Excludes real forms UI and production middleware credentials.

## 6. `feat/forms-conversion-engine`

Prerequisites: accepted conversion and BFF branches.

Required implementation:

- demo, sales, pricing, developer, partner, migration, support and newsletter forms;
- typed schemas;
- field normalization;
- service-contact versus marketing-consent separation;
- UTM/referrer/locale capture;
- honeypot/timing/CAPTCHA controls;
- accessible pending, validation, duplicate, rate-limited, success and retryable-failure states;
- form-to-API and CTA-to-form registry validation;
- component/browser/accessibility/security tests;
- mocked durable middleware outcomes.

## 7. `feat/middleware-odoo-n8n`

Prerequisites: accepted BFF and forms branches.

Required implementation:

- authenticated Codestra middleware client;
- approved secret-file/mTLS handling;
- durable acceptance contract;
- lead and consent event schemas;
- Odoo contact/company/CRM/activity/support mappings;
- n8n non-authoritative notification/routing contracts;
- idempotency, timeout, bounded retry and circuit behavior;
- dead-letter/reconciliation visibility;
- metrics and privacy-safe logs;
- test-mode integration verification.

No browser-to-Odoo/n8n calls and no direct Odoo database access.

## 8. `feat/interactive-tools`

Prerequisites: accepted conversion, BFF and forms branches.

Required implementation:

- configuration-driven pricing estimate;
- DNS-only domain readiness checker;
- no-side-effect API sandbox;
- migration chooser;
- static content search;
- approved scheduling handoff;
- strict cost/rate/body/time limits;
- lazy loading/code splitting;
- no arbitrary URL fetch, real email, billing or Odoo accounting effects.

## 9. `feat/seo-structured-data`

Prerequisites: accepted content and conversion branches.

Required implementation:

- unique metadata;
- canonical URLs;
- reciprocal English/Spanish hreflang and `x-default`;
- sitemap index and locale sitemaps;
- robots.txt;
- real 404;
- Organization/WebSite/BreadcrumbList and evidence-supported page schema;
- link, metadata, sitemap and structured-data validation;
- Search Console configuration hook;
- no invented reviews, ratings, prices or claims.

## 10. `feat/analytics-consent`

Prerequisites: accepted conversion and forms branches.

Required implementation:

- consent manager and persistence policy;
- optional GTM/GA4 adapter;
- approved event dictionary;
- CTA/form/locale/resource/popup events;
- UTM attribution;
- test/development traffic labeling;
- sensitive-value filters;
- no optional marketing analytics before required consent.

## 11. `perf/core-web-vitals-accessibility`

Prerequisites: all selected user-facing branches.

Required implementation:

- bundle and route analysis;
- image/font optimization;
- lazy loading and hydration reduction;
- mobile/tablet/laptop/desktop Playwright matrix;
- axe tests and WCAG 2.2 AA remediation;
- Lighthouse CI;
- Core Web Vitals instrumentation;
- explicit budget results and reviewed exceptions;
- no unmeasured score claims.

## 12. `ops/docker-runtime`

Prerequisites: accepted application branches and performance certification.

Required implementation:

- multi-stage Dockerfile;
- `.dockerignore`;
- local/staging/production compose;
- non-root/read-only runtime;
- health/readiness and SIGTERM handling;
- environment validation;
- immutable image publication;
- image scan and SBOM;
- staging deployment and rollback scripts;
- no public production activation.

## 13. `ops/caddy-edge`

Prerequisite: accepted Docker runtime.

Required implementation:

- Klyrow-only Caddy fragment;
- apex and `www` behavior;
- HTTPS readiness;
- compression, cache and security headers;
- request/body limits;
- privacy-safe logs;
- complete Caddy backup and validation;
- staging edge deployment;
- Caddy-only reload and rollback scripts;
- no unrelated site changes and no public activation.

## 14. `release/website-production-v1`

Prerequisites: all selected branches independently reviewed and integrated into the exact release candidate.

Responsibilities:

- exact SHA, immutable image digest and checksums;
- complete CI evidence;
- route/locale/sitemap count validation;
- CTA and form registry validation;
- staging deployment;
- middleware durability evidence;
- approved Odoo/n8n test-mode evidence;
- DNS/TLS/Caddy preflight;
- mobile/desktop/accessibility/SEO/Lighthouse checks;
- rollback rehearsal;
- public website deployment;
- post-deploy monitoring;
- sitemap/Search Console handoff;
- final completion report.

Only this branch may activate the public website after all gates pass.

## Pull request requirements

Every implementation PR contains:

1. scope and exclusions;
2. implementation summary;
3. API/route/component/form/CTA changes;
4. exact tests and results;
5. security impact;
6. performance impact;
7. accessibility impact;
8. screenshots or browser evidence;
9. operational changes;
10. rollback notes;
11. limitations/blockers;
12. confirmation that production was not changed.

## Commit rules

- Use logical commits.
- Do not force-push after review begins.
- Do not rewrite unrelated history.
- Commit `pnpm-lock.yaml`.
- Do not commit `.env`, credentials, private analytics values, Odoo keys, middleware keys, n8n credentials, CAPTCHA secrets or TLS private keys.
- Do not commit mutable build output to feature branches.

## Review flow

```text
planning
  -> shell/design
  -> content
  -> feature/pricing/conversion
  -> BFF/API
  -> forms
  -> middleware/Odoo/n8n
  -> interactive tools
  -> SEO
  -> analytics/consent
  -> performance/accessibility
  -> Docker
  -> Caddy
  -> production release
```

A branch name or empty task file is not proof of implementation. Codex must provide exact evidence for every stage.
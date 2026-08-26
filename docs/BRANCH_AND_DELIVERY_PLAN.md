# Klyrow Website — Branch and Delivery Plan

## Objective

Build the public Klyrow website through small, reviewable branches while keeping production activation isolated from ordinary feature work.

## Authoritative branch sequence

```text
planning/production-website-blueprint
feat/nuxt4-marketing-site
feat/website-odoo-n8n-forms
feat/website-seo-performance
ops/caddy-production
release/website-production-readiness
```

## 1. `planning/production-website-blueprint`

Documentation and contracts only:

- page inventory;
- content and design requirements;
- frontend/backend boundary;
- form and middleware contracts;
- SEO/performance requirements;
- deployment and rollback plan;
- Codex task and acceptance evidence.

No application code is deployed from this branch.

## 2. `feat/nuxt4-marketing-site`

Required implementation:

- Nuxt 4/Vue 3/TypeScript scaffold;
- Node 22/pnpm baseline and committed lock file;
- design tokens and reusable components;
- responsive header, mega menus, mobile navigation and footer;
- English/Spanish localization;
- 46 content page templates per locale;
- pricing, demo, contact and five audience landing pages;
- 21 feature pages;
- integration, developer and resource page templates;
- legal and utility pages;
- accessible popup and CTA system;
- custom lightweight diagrams;
- unit, component, browser and accessibility tests.

Must not connect to production middleware, Odoo, n8n or Caddy.

## 3. `feat/website-odoo-n8n-forms`

Prerequisite: reviewed/merged marketing-site branch.

Required implementation:

- typed same-origin Nuxt form APIs;
- validation and normalization;
- idempotency keys and request IDs;
- CSRF/origin checks;
- rate limits, honeypot and timing controls;
- optional CAPTCHA adapter;
- durable middleware client;
- lead/consent event contracts;
- Odoo/n8n mapping documentation and contract tests;
- test-mode integration verification;
- accessible pending/success/failure behavior;
- operational metrics and logs.

No browser-to-Odoo or browser-to-n8n calls.

## 4. `feat/website-seo-performance`

Prerequisites: reviewed marketing-site and forms branches.

Required implementation:

- page-level SEO metadata;
- canonical URLs and hreflang;
- sitemap index and locale sitemaps;
- robots.txt;
- Organization, WebSite, BreadcrumbList and supported page-specific JSON-LD;
- image/font optimization;
- route prerender rules;
- broken-link and metadata validation;
- consent-aware GTM/GA4 abstraction;
- Core Web Vitals instrumentation;
- Lighthouse CI and performance budgets;
- Search Console deployment checklist.

No invented reviews, ratings, prices, customers or claims.

## 5. `ops/caddy-production`

Prerequisites: reviewed product branches.

Required implementation:

- hardened production runtime;
- environment template without secrets;
- health/readiness endpoints;
- Caddy site fragment for `klyrow.com` and `www.klyrow.com`;
- HTTPS readiness, redirect, compression, cache and security headers;
- privacy-safe logs and rotation;
- staging Caddy configuration;
- release directory and symlink strategy;
- backup, validation, deployment, smoke and rollback scripts;
- no modification of unrelated Caddy sites.

This branch may be tested on staging but must not activate the public production site.

## 6. `release/website-production-readiness`

Prerequisites: all selected PRs independently reviewed and merged into the exact release candidate.

Responsibilities:

- exact release SHA and immutable artifact;
- complete CI evidence;
- staging deployment and acceptance;
- backup and rollback evidence;
- DNS/TLS/Caddy preflight;
- mobile, desktop, accessibility, SEO and Lighthouse checks;
- durable form routing test through middleware;
- approved test/production Odoo and n8n result verification;
- public website deployment;
- post-deploy smoke and monitoring;
- sitemap/Search Console handoff;
- final completion report.

Only this branch may activate the public website, and only after every gate in `CODEX_WEBSITE_PRODUCTION_TASK.md` passes.

## Pull request requirements

Every implementation PR must include:

1. exact scope;
2. implementation;
3. tests;
4. security implications;
5. performance implications;
6. accessibility implications;
7. screenshots/evidence;
8. operational changes;
9. rollback notes;
10. known limitations;
11. confirmation that production was not changed unless this is the authorized release PR.

## Commit rules

- Use logical commits.
- Do not force-push after review begins.
- Do not rewrite unrelated history.
- Commit `pnpm-lock.yaml`.
- Do not commit `.env`, credentials, analytics secrets, Odoo keys, middleware keys, n8n credentials or TLS private keys.
- Do not commit mutable build output to feature branches.

## Review order

```text
planning
  -> Nuxt/Vue site
  -> forms and integration
  -> SEO/performance/tracking
  -> Caddy/operations
  -> production-readiness release
```

Codex must provide exact evidence at each stage. Empty scaffold branches are not proof of implementation.
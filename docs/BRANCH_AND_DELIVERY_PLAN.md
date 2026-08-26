# Klyrow Website — Branch and Delivery Plan

## Objective

Build the public Klyrow website through small, reviewable branches while keeping production deployment isolated from ordinary feature work.

## Branches

### 1. `planning/production-website-blueprint`

Documentation and contracts only:

- page inventory;
- content and design requirements;
- frontend/backend boundary;
- form and middleware contracts;
- SEO/performance requirements;
- deployment and rollback plan;
- Codex task and acceptance evidence.

No application code is deployed from this branch.

### 2. `feat/nuxt4-marketing-site`

Required implementation:

- Nuxt 4/Vue 3/TypeScript scaffold;
- package manager and lock file;
- design tokens and reusable component library;
- responsive site header, mega menus, mobile navigation and footer;
- English and Spanish localization foundation;
- 46 content page templates and route data;
- pricing, demo, contact and audience landing page layouts;
- feature/integration/developer/resource page templates;
- legal and utility pages;
- accessible popup and CTA system;
- images, icons and custom SVG diagrams;
- initial unit, component and browser tests.

Must not connect to production middleware, Odoo, n8n or Caddy.

### 3. `feat/website-odoo-n8n-forms`

Prerequisite: reviewed/merged marketing-site branch.

Required implementation:

- typed same-origin Nuxt form APIs;
- form validation and normalization;
- idempotency keys and request IDs;
- CSRF/origin checks;
- rate limits, honeypot and timing controls;
- optional CAPTCHA adapter;
- durable middleware client;
- website lead event contracts;
- consent evidence;
- Odoo/n8n mapping documentation and contract tests;
- test-mode integration verification;
- accessible form success/failure behavior;
- operational metrics and logs.

No browser-to-Odoo or browser-to-n8n calls.

### 4. `feat/website-seo-performance`

Prerequisites: reviewed marketing-site and forms branches.

Required implementation:

- page-level SEO metadata;
- canonical URLs;
- hreflang;
- sitemap index and locale sitemaps;
- robots.txt;
- Organization, WebSite, BreadcrumbList and supported page-specific JSON-LD;
- image optimization;
- local font optimization;
- route prerender rules;
- broken-link and metadata validation;
- consent-aware GTM/GA4 abstraction;
- Core Web Vitals instrumentation;
- Lighthouse CI and performance budgets;
- Search Console deployment checklist.

No invented reviews, ratings, prices, customers or claims.

### 5. `ops/caddy-production`

Prerequisites: reviewed product branches.

Required implementation:

- production multi-stage container or hardened systemd runtime;
- environment template without secrets;
- health/readiness endpoints;
- Caddy site fragment for `klyrow.com` and `www.klyrow.com`;
- HTTPS, redirect, compression, cache and security headers;
- log rotation and privacy controls;
- staging Caddy configuration;
- release directory and symlink strategy;
- backup, validation, deployment, smoke and rollback scripts;
- no modification of unrelated Caddy sites.

This branch may be tested on staging but not activated publicly.

### 6. `release/website-production`

Prerequisites: all selected PRs independently reviewed and merged.

Responsibilities:

- exact release candidate SHA;
- immutable build artifact;
- complete CI evidence;
- staging deployment;
- responsive and browser acceptance;
- Google/Lighthouse tests;
- durable form routing tests;
- DNS and TLS preflight;
- Caddy backup/validate/reload;
- production deployment;
- post-deploy smoke and integration tests;
- Search Console/sitemap handoff;
- rollback rehearsal and commands;
- final completion report.

Only this branch may activate the public website in production.

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
11. confirmation that production was not changed unless this is the release PR.

## Commit rules

- Use logical commits.
- Do not force-push after review begins.
- Do not rewrite unrelated history.
- Commit `pnpm-lock.yaml`.
- Do not commit `.env`, production credentials, analytics secrets, Odoo keys, middleware keys, n8n credentials or TLS private keys.
- Do not commit build output unless the release process explicitly requires an immutable artifact in a release system.

## Review order

```text
planning
  -> Nuxt/Vue site
  -> forms and integration
  -> SEO/performance/tracking
  -> Caddy/operations
  -> production release
```

Codex must stop after each feature PR and provide evidence. It must not automatically begin the next branch until the prerequisite branch is reviewed or the owner explicitly instructs it to continue from an accepted baseline.
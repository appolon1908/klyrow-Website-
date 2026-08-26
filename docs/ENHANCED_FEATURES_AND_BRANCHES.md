# Klyrow Website — Enhanced Features and Clean Branches

## Goal

Build a conversion-focused, developer-friendly and operationally safe public website while keeping heavy capabilities isolated in reviewable branches.

## Superseded scaffold branches

The following early scaffolds are retained for history but are no longer authoritative for implementation:

```text
feat/nuxt4-marketing-site
feat/website-odoo-n8n-forms
feat/website-seo-performance
ops/caddy-production
release/website-production-readiness
```

Do not continue implementation on those branches. Their scope was too broad.

## Authoritative implementation branches

### 1. `feat/site-shell-design-system`

Owns:

- Nuxt 4/Vue 3/TypeScript scaffold;
- pnpm/Node baseline;
- app shell;
- design tokens;
- typography and spacing;
- header, mega menus and mobile drawer;
- footer;
- buttons, links, fields, cards, accordions, tabs, dialogs and toasts;
- CTA rendering primitive;
- responsive foundations;
- English/Spanish localization framework;
- base unit, component, keyboard and accessibility tests.

Does not own content volume, forms, APIs, middleware, analytics, SEO or Docker.

### 2. `feat/content-localization-pages`

Owns:

- data-driven page content model;
- 46 English indexable pages;
- 46 Spanish equivalents;
- legal/utility route behavior;
- navigation and footer content;
- breadcrumbs;
- route manifest;
- localized page completeness tests;
- no thin automatic translation placeholders.

Depends on the shell/design-system branch.

### 3. `feat/feature-pricing-conversion`

Owns:

- five audience landing experiences;
- 21 feature pages;
- pricing page;
- plan comparison;
- conversion sections;
- CTA registry;
- environment-controlled sign-in/docs/status destinations;
- contact-sales mode when approved prices are absent;
- popup and announcement CTA behavior;
- automated dead-CTA validation.

Does not own form submissions or interactive server tools.

### 4. `feat/public-api-bff`

Owns:

- `/api/v1` same-origin API framework;
- common request/response types;
- RFC 7807-style errors;
- request IDs;
- idempotency interface;
- origin and CSRF controls;
- body limits;
- rate-limit abstraction;
- safe redirect allowlist;
- public configuration;
- health/readiness;
- API documentation and contract tests;
- mocked middleware boundary.

Does not own form UI or real middleware credentials.

### 5. `feat/forms-conversion-engine`

Owns:

- request-demo;
- contact-sales;
- pricing-consultation;
- developer-interest;
- partner-application;
- support-contact;
- newsletter;
- migration-consultation;
- typed schemas;
- accessible form components;
- pending, validation, duplicate, rate-limited, accepted and retryable-failure states;
- honeypot, timing and CAPTCHA adapter integration;
- CTA-to-form wiring;
- browser conversion tests.

Uses the BFF's mocked middleware adapter until integration branch completion.

### 6. `feat/middleware-odoo-n8n`

Owns:

- authenticated Codestra middleware client;
- mTLS/API-key secret-file handling as approved;
- durable acceptance contract;
- website lead/consent events;
- Odoo CRM/contact/activity/support mappings;
- n8n notification/routing contracts;
- retry, timeout, circuit and idempotency behavior;
- test-mode integration evidence;
- operational metrics and reconciliation docs;
- dead-letter visibility.

The browser never communicates with Odoo or n8n.

### 7. `feat/interactive-tools`

Owns heavy optional features:

- pricing estimator;
- domain/DNS readiness checker;
- API sandbox playground;
- migration consultation chooser;
- content search;
- meeting-scheduling handoff;
- tool abuse/rate limits;
- lazy loading and code splitting;
- no-side-effect test fixtures.

This branch must not send real email, create real billing or fetch arbitrary URLs.

### 8. `feat/seo-structured-data`

Owns:

- page-level metadata;
- canonical URLs;
- reciprocal hreflang and `x-default`;
- sitemap index and locale sitemaps;
- robots.txt;
- real 404 behavior;
- Organization, WebSite and BreadcrumbList structured data;
- only evidence-supported page-specific structured data;
- broken-link and metadata validation;
- Search Console configuration hooks.

### 9. `feat/analytics-consent`

Owns:

- consent state;
- GTM/GA4 abstraction;
- approved event dictionary;
- CTA and form tracking;
- UTM normalization;
- analytics privacy filters;
- test/development traffic labeling;
- no optional marketing analytics before consent where required.

### 10. `perf/core-web-vitals-accessibility`

Owns:

- bundle analysis;
- image/font optimization;
- route-level lazy loading;
- hydration reduction;
- responsive image policy;
- Core Web Vitals instrumentation;
- Lighthouse CI;
- Playwright device matrix;
- axe checks;
- WCAG 2.2 AA remediation;
- reviewed performance-budget exceptions.

### 11. `ops/docker-runtime`

Owns:

- Dockerfile and `.dockerignore`;
- local/staging/production compose;
- startup environment validation;
- non-root/read-only container;
- health/readiness checks;
- build, scan, SBOM and immutable image publication;
- staging deployment and rollback scripts.

Does not switch public production traffic.

### 12. `ops/caddy-edge`

Owns:

- Klyrow Caddy site fragment;
- apex/`www` behavior;
- TLS preflight;
- cache/compression/security headers;
- form body limits;
- privacy-safe access logs;
- Caddy backup/validation/reload/rollback scripts;
- staging edge verification.

Does not change unrelated site blocks and does not activate public production.

### 13. `release/website-production-v1`

Owns:

- integration of reviewed feature branches;
- exact release SHA/image digest;
- full CI and acceptance evidence;
- staging deployment;
- form durability test;
- approved Odoo/n8n test-mode evidence;
- DNS/TLS/Caddy preflight;
- public website deployment;
- monitoring and rollback;
- sitemap/Search Console handoff;
- final report.

## Enhanced website capabilities

### Use-case selector

Visitors choose their primary objective and receive a tailored route and CTA:

```text
Build with API/SMTP
Run marketing campaigns
Manage agency/reseller customers
Operate enterprise communications
Connect Odoo and automation
Migrate from another provider
```

### Plan comparison

Configuration-driven comparison for:

- sending volume;
- profiles/contacts;
- seats;
- support level;
- dedicated infrastructure options;
- reseller capability;
- Odoo/middleware integration;
- compliance and enterprise controls.

No unapproved prices or guarantees.

### Domain readiness tool

Educational checks for public DNS records and setup readiness with clear limitations. It must not probe internal networks, fetch arbitrary URLs or claim guaranteed inbox placement.

### API sandbox

Interactive examples with mocked/test responses only. Visitors can copy examples for curl, JavaScript/TypeScript, Python and PHP without receiving a real secret.

### Migration consultation

Guided flow that gathers provider, volume, domain, template, suppression and desired-timeline information for CRM routing.

### Conversion quality

- one primary CTA per major section;
- contextual secondary CTA;
- clear post-submit next steps;
- no immediate obstructive popup;
- frequency-capped engagement popup;
- no popup on legal/success/error routes;
- no popup on small screens when it obstructs content;
- no false urgency or fabricated scarcity.

## Dependency order

```text
site-shell-design-system
  -> content-localization-pages
  -> feature-pricing-conversion

public-api-bff
  -> forms-conversion-engine
  -> middleware-odoo-n8n

feature-pricing-conversion + public-api-bff
  -> interactive-tools

content + conversion
  -> seo-structured-data
  -> analytics-consent

all user-facing branches
  -> core-web-vitals-accessibility
  -> docker-runtime
  -> caddy-edge
  -> production-v1
```

Codex must not implement dependent branches against empty scaffolds. Each branch must be refreshed from accepted prerequisites.

## PR acceptance minimum

Every PR includes:

- exact scope and exclusions;
- implementation;
- type/lint/test/build results;
- route/API/form/CTA coverage where applicable;
- mobile/tablet/desktop evidence;
- accessibility impact;
- performance impact;
- security impact;
- operational changes;
- rollback notes;
- known limitations;
- confirmation that production was not changed.

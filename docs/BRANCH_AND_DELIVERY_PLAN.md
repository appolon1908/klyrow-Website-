# Klyrow Website — Branch and Delivery Plan

## Objective

Build and release the Klyrow public website through focused branches while deploying the final website on the same host as the Klyrow email platform:

```text
37.27.128.39
10.40.0.4
existing Nginx + Certbot edge
```

A branch or PR is only a workspace. Use `docs/IMPLEMENTATION_STATUS_AND_RELEASE_TRUTH.md` for status language.

## Authoritative reading

1. `CODEX_WEBSITE_PRODUCTION_TASK.md`
2. `CODEX_PROVIDER_HOST_DEPLOYMENT_TASK.md`
3. `CODEX_WEBSITE_HARDENING_AND_DOCKER_TASK.md`
4. `docs/IMPLEMENTATION_STATUS_AND_RELEASE_TRUTH.md`
5. `docs/REPOSITORY_ARCHITECTURE_AND_API_CATALOG.md`
6. `docs/API_FORM_CTA_CONTRACT.md`
7. `docs/LEGAL_PRIVACY_COOKIE_COMPLIANCE.md`
8. `docs/ENHANCED_FEATURES_AND_BRANCHES.md`
9. `docs/DOCKER_RUNTIME_AND_DEPLOYMENT.md`
10. `docs/PROVIDER_HOST_NGINX_DEPLOYMENT.md`
11. sitemap, forms, SEO and original edge contracts;
12. the active branch's `CODEX_BRANCH_TASK.md`.

The provider-host override controls whenever older documentation mentions `65.109.65.169`, `10.40.0.1`, Caddy, or website port 3100.

## Superseded branches

Do not implement or deploy from:

```text
feat/nuxt4-marketing-site
feat/website-odoo-n8n-forms
feat/website-seo-performance
ops/caddy-production
ops/caddy-edge
release/website-production-readiness
```

## Authoritative sequence

```text
planning/production-website-blueprint
  -> refactor/modular-website-architecture
  -> feat/site-shell-design-system
  -> feat/content-localization-pages
  -> feat/feature-pricing-conversion
  -> feat/public-api-bff
  -> feat/forms-conversion-engine
  -> feat/legal-privacy-cookie-center
  -> feat/middleware-odoo-n8n
  -> feat/interactive-tools
  -> feat/seo-structured-data
  -> feat/analytics-consent
  -> perf/core-web-vitals-accessibility
  -> ops/docker-runtime
  -> ops/provider-host-nginx-edge
  -> release/website-production-v1
```

Before implementation, each branch is recreated or updated from exact accepted prerequisites. Scaffold SHAs are not implementation baselines.

## Branch ownership

### `refactor/modular-website-architecture`

Creates the pnpm workspace, `apps/web`, shared contracts/packages, strict TypeScript, configuration classification, module boundaries, test foundations and PR CI. No user-facing expansion or deployment.

### `feat/site-shell-design-system`

Creates the responsive Nuxt/Vue shell, Klyrow tokens, navigation, footer, base components, CTA primitive, localization shell and accessibility tests.

### `feat/content-localization-pages`

Creates the typed marketing content system, 46 English pages, 46 Spanish pages, localized navigation/related links, route manifest and reusable legal renderer foundation.

### `feat/feature-pricing-conversion`

Creates five audience landings, 21 feature pages, approved-value pricing/plan comparison, CTA registry, use-case selector and conversion components.

### `feat/public-api-bff`

Creates the modular `/api/v1` same-origin BFF, schemas, request IDs, problem responses, idempotency, limits, public configuration, legal/cookie/privacy/form/tool contracts and mocked durable middleware adapter.

### `feat/forms-conversion-engine`

Creates one shared commercial, support, security, abuse, DPA, privacy and subscription form engine with accessible states, attribution, anti-abuse and mocked durable outcomes.

### `feat/legal-privacy-cookie-center`

Creates bilingual legal-document lifecycle, legal hub/pages, cookie/storage registry, cookie settings, privacy request/status utilities, GPC support, single consent gate and counsel-approval release boundary.

### `feat/middleware-odoo-n8n`

Creates the authenticated Codestra middleware adapter, durable acceptance, website event contracts, Odoo CRM/helpdesk/privacy mappings, non-authoritative n8n routing, metrics, retries and dead-letter guidance.

### `feat/interactive-tools`

Creates pricing estimate, DNS-only readiness, safe API sandbox, migration chooser, public-content search and scheduling handoff without real email/billing or arbitrary network probing.

### `feat/seo-structured-data`

Creates metadata, canonical/hreflang, marketing and approved-legal sitemaps, robots, real 404/noindex behavior, accurate structured data, internal links and crawl validators.

### `feat/analytics-consent`

Consumes the legal cookie preference state and adds optional consent-aware GTM/GA4, safe event contracts, UTM attribution and payload filters. It must not create a second consent system.

### `perf/core-web-vitals-accessibility`

Measures and remediates bundles, assets, hydration, Core Web Vitals, browser devices, keyboard flows, legal/privacy UX and WCAG 2.2 AA.

### `ops/docker-runtime`

Packages the website as an immutable non-root container. It may stage on provider-host loopback port 18111 or an audited alternative. It must not switch public Nginx traffic.

### `ops/provider-host-nginx-edge`

Audits the real Nginx/Certbot provider host, preserves all current Klyrow services, creates the apex/`www` website host split, validates backup/reload/rollback tooling and rehearses staging. It may not activate public production.

### `release/website-production-v1`

Integrates exact reviewed SHAs, certifies the application/container/integrations/SEO/legal/analytics/accessibility and provider-host edge, then switches public apex traffic only after all gates and explicit owner GO.

## Provider-host boundaries

The website uses preferred loopback ports only after an occupied-port audit:

```text
production 18110
staging    18111
```

Protected services include the existing Nginx edge, Klyrow gateway, Postal, SMTP, Mautic, Grafana, billing, Keycloak/private gateway and Kyqra. The website must not reuse their ports, restart them or change their routing.

Required hostname end state:

```text
klyrow.com / www.klyrow.com -> website
app.klyrow.com               -> existing Klyrow application
api.klyrow.com               -> existing Klyrow API
track/bounce                  -> preserve audited delivery behavior
```

## PR requirements

Every PR includes:

1. exact scope and prerequisite SHAs;
2. approved current-status block;
3. implementation and changed files;
4. exact tests/results;
5. route/API/form/CTA/legal/cookie changes;
6. security/privacy/accessibility/performance impact;
7. operational and rollback notes;
8. blockers/limitations;
9. confirmation that staging/production remained unchanged unless explicitly authorized.

## Commit and safety rules

- logical commits;
- no force-push after review begins;
- no unrelated history rewrites;
- committed lockfile;
- no secrets, `.env`, keys or TLS private material;
- no mutable build output on feature branches;
- no direct browser-to-middleware/Odoo/n8n access;
- no direct Odoo database writes;
- no website deployment that restarts the provider stack;
- no Caddy installation on `37.27.128.39`.

## Current status

```text
ARCHITECTURE_PR_17=IMPLEMENTED_CI_PASS_REVIEW_PENDING
REMAINING_FEATURES=NOT_COMPLETE
STAGING=NOT_ACTIVE
PRODUCTION=NOT_ACTIVE
LIVE=NO
```
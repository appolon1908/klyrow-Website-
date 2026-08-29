# Klyrow Website

## Repository authority

This repository is the **public Klyrow marketing website frontend authority**.

`appolon1908-hue/klyrow.com` is the separate **Klyrow email/SaaS backend and runtime authority**. It owns Postal/Mautic integration, tenant/application state, authenticated email/campaign APIs, delivery events, suppressions, domain onboarding, billing foundations and runtime operations.

This website must not create a second Postal/Mautic backend, email queue, delivery ledger, tenant database or provider credential store. Browser forms and customer actions must cross the governed Kong/Middleware boundary and must not write directly to Odoo, n8n, Postal, Mautic or provider databases.

```text
Browser -> klyrow-Website- -> Kong/Middleware -> klyrow.com -> Postal/Mautic
```

## Current status

```text
PLANNING_AND_BRANCH_SCAFFOLDS=AVAILABLE
MODULAR_ARCHITECTURE_SCAFFOLD=VERIFIED_IN_CI
APPLICATION_IMPLEMENTATION=NOT_COMPLETE
MAIN_RELEASE_BASELINE=NOT_READY
STAGING_DEPLOYMENT=NOT_ACTIVE
PRODUCTION_DEPLOYMENT=NOT_ACTIVE
PUBLIC_WEBSITE_LIVE=NO
```

This branch provides the minimal Nuxt 4/Vue 3 workspace, shared contracts, module boundaries, test foundations, and CI needed for later feature branches. It does not provide the complete website, live forms, middleware/Odoo/n8n integrations, Docker/Caddy deployment, or production activation.

Do not deploy this feature branch or `main` as a production website. Production activation is permitted only from the final reviewed release branch after CI, staging, DNS, TLS, Caddy, middleware, Odoo/n8n test routing, accessibility, performance, security, and rollback gates pass.

## Authoritative documents

- `CODEX_WEBSITE_PRODUCTION_TASK.md`
- `CODEX_WEBSITE_HARDENING_AND_DOCKER_TASK.md`
- `docs/IMPLEMENTATION_STATUS_AND_RELEASE_TRUTH.md`
- `docs/REPOSITORY_ARCHITECTURE_AND_API_CATALOG.md`
- `docs/BRANCH_AND_DELIVERY_PLAN.md`
- `docs/API_FORM_CTA_CONTRACT.md`
- `docs/LEGAL_PRIVACY_COOKIE_COMPLIANCE.md`
- `docs/DOCKER_RUNTIME_AND_DEPLOYMENT.md`
- `docs/SITEMAP_CONTENT_AND_DESIGN.md`
- `docs/FORMS_MIDDLEWARE_ODOO_N8N.md`
- `docs/SEO_PERFORMANCE_AND_TRACKING.md`
- `docs/CADDY_PRODUCTION_DEPLOYMENT.md`

## Safety boundaries

- Browsers never call Odoo or n8n directly.
- No direct Odoo database writes.
- No secrets in Git or public runtime configuration.
- No live email delivery, Postal changes, real billing, or unrelated service changes.
- No feature or operations branch deploys public production.

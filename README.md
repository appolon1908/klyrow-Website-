# Klyrow Website

## Repository authority

This repository is the **public Klyrow marketing website frontend authority**.

`appolon1908-hue/klyrow.com` is the separate **authenticated Klyrow application, email, and runtime authority**. It owns browser-session security, tenant/application state, Postal/Mautic integration, delivery events, suppressions, domain onboarding, billing foundations, provider credentials, and runtime operations.

The public website must not create a second identity client, browser token store, Postal/Mautic backend, email queue, delivery ledger, tenant database, or provider credential store. Public forms and tools may cross a reviewed server-side Kong/Middleware boundary; browsers must never write directly to Odoo, n8n, Postal, Mautic, or provider databases.

```text
Public browser -> klyrow-Website- server adapter -> Kong/Middleware -> governed services
Account browser -> app.klyrow.com -> klyrow.com application authority
```

## Current source status

```text
HORIZON_PUBLIC_SHELL=PROTECTED_ON_MAIN
PUBLIC_ONLY_AUTH_BOUNDARY=ENFORCED
BROWSER_TOKEN_STORAGE=PROHIBITED
IMMUTABLE_DEPLOY_READINESS_SOURCE_GATE=AVAILABLE
LOCALIZED_CONTENT_RECONCILIATION=IN_PROGRESS
STAGING_DEPLOYMENT=NOT_CERTIFIED
PRODUCTION_DEPLOYMENT=NOT_ACTIVE
PUBLIC_EDGE_CUTOVER=NOT_AUTHORIZED
```

The current `main` provides the Nuxt 4/Vue 3 workspace, Horizon public shell, shared header/footer, semantic tokens, application handoff, source tests, and deploy-readiness governance. It is a source authority—not evidence that an immutable image has been deployed or that public DNS now serves this build.

## Edge authority

The current provider-host direction is the **existing Nginx + Certbot edge**, with the website isolated on a reviewed loopback port. Do not install Caddy or execute the historical `docs/CADDY_PRODUCTION_DEPLOYMENT.md` plan.

The current source contract is `docs/PROVIDER_HOST_NGINX_DEPLOYMENT.md`. The Caddy document is retained only as historical reference until removed in a focused cleanup; it is non-authoritative and must not be executed.

## Authoritative documents

- `REPOSITORY_PROFILE.md`
- `HORIZON-ADOPTION.md`
- `OWNER_WEBSITE_PRODUCTION_DIRECTIVE.md`
- `docs/PROVIDER_HOST_NGINX_DEPLOYMENT.md`
- `docs/DOCKER_RUNTIME_AND_DEPLOYMENT.md`
- `docs/IMPLEMENTATION_STATUS_AND_RELEASE_TRUTH.md`
- `docs/REPOSITORY_ARCHITECTURE_AND_API_CATALOG.md`
- `docs/BRANCH_AND_DELIVERY_PLAN.md`
- `docs/API_FORM_CTA_CONTRACT.md`
- `docs/LEGAL_PRIVACY_COOKIE_COMPLIANCE.md`
- `docs/SITEMAP_CONTENT_AND_DESIGN.md`
- `docs/FORMS_MIDDLEWARE_ODOO_N8N.md`
- `docs/SEO_PERFORMANCE_AND_TRACKING.md`

Historical task prompts and Caddy plans do not override the current profile, Horizon boundary, Nginx edge contract, protected-main source, or exact-head release evidence.

## Release boundary

Do not deploy an arbitrary feature branch or mutable image. Production activation requires one exact protected-main SHA and immutable digest, staging-readonly certification, DNS/TLS and Nginx validation, protected-service checks, backups, rollback rehearsal, accessibility, performance, security, and an explicit production change approval.

A pull-request merge performs no deployment and enables no live email effect.

## Safety boundaries

- Browsers never call Odoo, n8n, Postal, or Mautic directly.
- No access, refresh, or ID token is stored by the public website.
- No direct Odoo database write or provider administration.
- No secrets in Git or public runtime configuration.
- No live email delivery, Postal change, real billing, DNS mutation, Nginx reload, or unrelated service change from an ordinary source merge.

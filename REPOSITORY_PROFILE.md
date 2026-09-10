# Repository Profile — Klyrow Website

## Identity

- **Repository:** `appolon1908-hue/klyrow-Website-`
- **Visibility:** private
- **Default branch:** `main`
- **Category:** first-party public website
- **Canonical public origin:** `https://klyrow.com`
- **Redirect-only alias:** `https://www.klyrow.com`
- **Authenticated application:** `https://app.klyrow.com`
- **Application authority repository:** `appolon1908-hue/klyrow.com`
- **Canonical identity issuer:** `https://auth.codestra.co/realms/codestra`
- **Edge target:** existing provider-host Nginx; this repository does not authorize Caddy installation

## Current source authority

The protected source direction is the Horizon public-site shell merged through PR #27 on top of the immutable deploy-readiness workflow merged through PR #29.

The website currently owns a real Nuxt/Vue public shell with:

- responsive shared header and footer;
- semantic Horizon design tokens;
- public routes for platform, developers, security, pricing, contact, privacy, terms, and application handoff;
- a Codestra product-network footer;
- repository gates for suite registration, page inheritance, raw-color control, public-only authentication boundaries, type checking, lint, tests, build, dependency analysis, secret scanning, and deploy-readiness source validation.

Source merge is not runtime certification. DNS, Nginx cutover, immutable image promotion, and production traffic remain separately gated.

## Purpose

Klyrow Website explains the product, developer integration, trust model, pricing posture, legal information, and sales/support paths. It gives users truthful handoffs to the separately governed Klyrow application without exposing provider credentials or moving account authority into the marketing bundle.

## Owns

- public Klyrow marketing and informational pages;
- shared public header, footer, navigation, semantic visual system, and responsive behavior;
- bilingual/public content as it is selectively reconciled onto current `main`;
- public SEO, accessibility, performance, and crawl controls;
- same-origin public forms only after their server-side adapter and durable Middleware acceptance are reviewed;
- immutable website image, Nginx edge, staging, rollback, and production-readiness source contracts.

## Does not own

- OIDC code exchange, access tokens, refresh tokens, ID tokens, browser session persistence, or protected account rendering;
- tenant membership, roles, entitlements, billing authority, campaigns, delivery ledgers, suppression authority, or provider credentials;
- Postal, Mautic, SMTP, database, Odoo, n8n, Kong, or Keycloak runtime administration;
- direct browser-to-Odoo, browser-to-n8n, browser-to-Postal, or browser-to-Mautic calls;
- activation of live email delivery, DNS changes, Nginx reloads, or production traffic from an ordinary source merge.

## Authentication boundary

The public website is registered as `public-only`.

- Browser token storage is prohibited.
- The public bundle performs no authorization-code exchange or token refresh.
- `Open app` and `Create account` hand off to `https://app.klyrow.com`.
- The application repository owns PKCE, secure host-only cookies, encrypted server-side tokens, CSRF, tenant authorization, protected deep links, session expiry, logout, logout-all, and audit evidence.
- Durable identity is canonical issuer plus immutable subject, never an email address.

Any future shell migration must preserve this boundary and replace the active shell through reviewed migration evidence rather than adding a parallel identity or design authority.

## Integration boundary

Public form and tool work must call a reviewed server-side adapter. The adapter may reach Codestra Middleware using bounded timeouts, correlation IDs, idempotency keys, optional mTLS, and durable acceptance. Odoo and n8n remain behind Middleware and are never browser authorities.

A successful HTTP response without a reviewed durable receipt is not success. Live customer effects remain disabled until staging and production activation gates explicitly authorize them.

## Delivery and release model

Required source and runtime sequence:

1. build from an exact protected-main SHA;
2. produce immutable image digests, SBOM, provenance, vulnerability evidence, and source labels;
3. deploy those exact digests to `staging-readonly` without rebuilding or retagging;
4. verify health, readiness, version/source readback, routes, headers, accessibility, and zero live effects;
5. back up Nginx configuration and any required release metadata;
6. rehearse rollback to the previous exact image and edge configuration;
7. obtain protected environment approval before any production read-only canary;
8. stop and roll back on source mismatch, health loss, monitoring loss, unexpected write, or public-route regression.

A repository merge does not satisfy these runtime gates.

## Current build-out order

1. selectively reconcile the 46 English and 46 Spanish content routes onto the current Horizon shell;
2. add configuration-driven pricing and validated CTA contracts without invented production prices;
3. add the modular public `/api/v1` BFF and durable form intake while keeping direct external effects disabled;
4. reconcile legal/privacy/cookie content, keeping unapproved legal text visibly draft and non-indexable;
5. add Middleware integration, bounded public tools, SEO, consent-aware analytics, accessibility, and performance gates;
6. reconcile immutable Docker, provider-host Nginx, staging, backup/restore, and rollback source contracts;
7. certify one exact immutable release before any production traffic.

Historical stacked branches are source candidates only. They must be ported selectively from current `main`; stale shell, auth, workflow, edge, or release files must not be replayed wholesale.

## Governance and safety

- Use pull requests and exact-head CI for every code-bearing change.
- Keep secrets and real identity values out of Git.
- Do not weaken public-only auth, tenant boundaries, idempotency, suppression/consent, or fail-closed delivery gates to make CI pass.
- Do not claim live pricing, delivery success, customer counts, legal approval, provider availability, or production certification without evidence.
- Keep `LIVE_EMAIL_DELIVERY`, provider routing, customer sends, DNS mutation, and production cutover outside ordinary source merges.

This document changes no runtime, provider, identity, database, email delivery, DNS, or production traffic.

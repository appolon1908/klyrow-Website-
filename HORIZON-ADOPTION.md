# Klyrow Horizon public-site adoption

## Source authority

- Horizon repository: `appolon1908-hue/SDK-repository`
- Foundation PR: `#73`
- Visual-contract exact head: `7db4c6549a0a007922355090f03c082a308f3855`
- Governance validator: `b258cf952df3a2ef11a2ba2e0df16c7983ee2a99`
- Adoption branch: `feature/horizon-portfolio-shell-v1`
- Product theme: `klyrow`
- Runtime activation: **not included**

## Canonical surfaces

| Role | Authority |
|---|---|
| Public marketing website | `https://klyrow.com` |
| Redirect-only alias | `https://www.klyrow.com` → `https://klyrow.com` |
| Authenticated application | `https://app.klyrow.com` |
| Canonical identity issuer | `https://auth.codestra.co/realms/codestra` |
| Application source authority | `appolon1908-hue/klyrow.com` |
| Corporate authority | `https://codestra.co` |

The public website explains Klyrow and links to the separately governed application. It does not own an OIDC callback, exchange authorization codes, refresh tokens, inspect account sessions, or render protected customer data.

## Authentication boundary

This repository is registered as a `public-only` Horizon suite.

- Browser token storage is forbidden.
- No access token, refresh token, or ID token may enter `localStorage`, `sessionStorage`, IndexedDB, a public cookie, a URL fragment, or an application log.
- The public header exposes **Open app** and **Create account** handoffs to `app.klyrow.com`.
- `/account` is a public, noindex explanation and handoff page. It is not a protected account surface.
- The authenticated application owns the secure host-only session cookie, encrypted server-side tokens, PKCE transaction, CSRF enforcement, tenant authorization, protected deep links, session expiry, logout, logout-all, and audit evidence.
- Durable identity remains canonical issuer plus immutable subject, never email.
- The identity host is not a direct public navigation target; browser identity flows start through the application boundary.

The historical branch contained client-side code exchange and browser token persistence. This rebuilt candidate intentionally excludes:

- `apps/web/app/composables/useKlyrowSession.ts`
- `apps/web/app/lib/klyrow-auth.ts`
- `apps/web/app/middleware/klyrow-auth.ts`
- `apps/web/app/plugins/klyrow-auth.client.ts`
- the historical browser-token unit test

A repository test scans the public application source and fails if those files or token-exchange/storage markers return.

## Page and color rule

`apps/web/app/app.vue` defines the Horizon root once. Every page inherits:

- the shared header and footer;
- the `klyrow` theme and registered token files;
- typography, spacing, focus, forms, cards, tables, CTA hierarchy, and reduced-motion behavior;
- the global error boundary;
- applicable loading, empty, partial, stale, degraded, validation-error, server-error, offline, and durable-success states.

New page and component changes must use Horizon variables. New raw hex, RGB, HSL, Lab, LCH, or OKLCH values are rejected outside registered token files. Semantic success, warning, danger, and information colors remain separate from the Klyrow accent.

`apps/web/app/assets/css/horizon.css` is a generated adapter pinned to the visual-contract exact head. Replace it only with an immutable released Horizon package whose source, version, integrity, license, and rollback version are recorded.

## New page and suite rule

A new public page must live below the registered Nuxt root, inherit the root shell, use tokens, preserve the public/application boundary, implement applicable states, and add route, unit, accessibility, and visual evidence.

A new Klyrow suite cannot be merged only by adding another `apps/*` directory. Before merge it must register:

1. canonical HTTPS domains and surface type;
2. root layout, page roots, theme, token file, and shell type;
3. truthful public-only or protected authentication mode;
4. backend-authoritative permission, tenant, record, capability, and state checks when protected;
5. page-state, accessibility, build, test, security, deployment, and rollback evidence.

`horizon/suite.json` and `.github/workflows/horizon-contract.yml` enforce suite registration, public authentication boundaries, root markers, token variables, and no-new-raw-color rules.

## Scope

This candidate establishes:

- the shared Horizon header and footer;
- accessible desktop and mobile navigation;
- canonical public, application, identity, and corporate domains;
- real public routes for platform, developers, security, pricing, contact, privacy, terms, and application handoff;
- a truthful homepage that does not claim live delivery, billing, automation, or provider availability;
- the Codestra product-network footer;
- a tested prohibition on browser-side identity authority.

## Validation

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
pnpm test:a11y
```

This branch changes source only. It does not configure Keycloak, activate live email delivery, configure Postal, enable billing, modify Odoo, activate n8n, change DNS, deploy a release, or route production traffic.

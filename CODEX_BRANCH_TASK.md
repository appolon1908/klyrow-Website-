# Codex Branch Task — Site Shell and Design System

## Branch

```text
feat/site-shell-design-system
```

## Status

```text
FEATURE_STATUS=SCAFFOLDED
APPLICATION_CODE_PRESENT=NO
STAGING_CHANGED=NO
PRODUCTION_CHANGED=NO
```

## Prerequisite

Do not implement this branch directly from the planning scaffold. First accept and merge/rebase from:

```text
refactor/modular-website-architecture
```

The modular architecture branch owns the pnpm workspace, `apps/web`, shared packages, strict TypeScript, module boundaries, contracts, configuration, and test foundation. This branch must extend that structure rather than create a competing root-level Nuxt app.

## Objective

Create the Nuxt 4/Vue 3/TypeScript application shell and original Klyrow design system inside the accepted modular architecture. Do not implement bulk content, public forms, legal content, middleware integration, SEO, analytics, Docker, Caddy, staging, or production in this branch.

## Required reading

Read all blueprint documents, especially:

- `docs/IMPLEMENTATION_STATUS_AND_RELEASE_TRUTH.md`
- `docs/REPOSITORY_ARCHITECTURE_AND_API_CATALOG.md`
- `CODEX_WEBSITE_PRODUCTION_TASK.md`
- `CODEX_WEBSITE_HARDENING_AND_DOCKER_TASK.md`
- `docs/BRANCH_AND_DELIVERY_PLAN.md`
- `docs/ENHANCED_FEATURES_AND_BRANCHES.md`
- `docs/API_FORM_CTA_CONTRACT.md`
- `docs/LEGAL_PRIVACY_COOKIE_COMPLIANCE.md`

## Preflight

Print repository, remote, current directory, branch, starting SHA, git status, Node version, Corepack version, and pnpm version.

Confirm:

- accepted modular-architecture SHA is an ancestor;
- the application lives under `apps/web`;
- shared package boundaries exist;
- the working tree is clean;
- no production checkout is being used.

## Required implementation

- Nuxt 4/Vue 3 shell under `apps/web`.
- Extend, do not duplicate, the accepted Node/Corepack/pnpm/TypeScript/lint configuration.
- Original Klyrow design tokens for color, typography, spacing, radius, shadow, and motion in the approved package boundary.
- Responsive application shell.
- Skip link.
- Accessible desktop header and mega-menu primitives.
- Accessible mobile navigation drawer with escape close, focus management, scroll lock, and restoration.
- Footer and locale-switcher primitives.
- Reusable button, link, field, select, textarea, checkbox, radio, card, accordion, tabs, modal/dialog, drawer, toast, alert, badge, breadcrumb, and section components.
- CTA rendering component driven by shared typed definitions; fixtures only.
- Loading, empty, error, configuration-unavailable, and offline states.
- Reduced-motion behavior.
- English/Spanish shell localization with sample strings.
- Component documentation/examples sufficient for later branches.
- No giant component containing the whole site shell; split by cohesive responsibility.

## Design rules

- Spacious editorial layout with large typography.
- Strong blue/violet identity with controlled cyan, coral, lime, and amber accents.
- Accessible neutral surfaces.
- Original work only; do not copy Apple assets, markup, content, or distinctive compositions.
- No fabricated customer proof, statistics, prices, certifications, or claims.
- Mobile-first and usable from 320px through wide desktop.
- No design-system component may contain domain-specific API or Odoo/n8n logic.

## Required tests

- unit/component tests for every primitive;
- keyboard tests for menus, drawer, tabs, dialogs, and fields;
- focus restoration and escape behavior;
- axe tests for representative components;
- reduced-motion test;
- locale-switcher test;
- CTA-fixture rendering test;
- module-boundary regression test;
- type check, lint, unit/component suite, and Nuxt production build;
- no secret/browser-token storage or external integration access.

## CI

Add only the foundational UI checks required by this branch. Preserve architecture checks. Do not add production deployment.

## Git delivery

Create logical commits, push only this branch, update draft PR #4, post exact test/build evidence, and stop after this branch.

## Prohibited

- no production or staging deployment;
- no forms or live APIs;
- no legal/cookie implementation;
- no Odoo/n8n/middleware connection;
- no Docker/Caddy changes;
- no secrets;
- no root-level competing Nuxt application;
- no work from later branches.
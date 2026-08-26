# Codex Branch Task — Site Shell and Design System

## Branch

```text
feat/site-shell-design-system
```

## Objective

Create the Nuxt 4/Vue 3/TypeScript application foundation and original Klyrow design system. Do not implement bulk content, public forms, middleware integration, SEO, analytics, Docker or production deployment in this branch.

## Required reading

Read all blueprint documents, especially:

- `CODEX_WEBSITE_PRODUCTION_TASK.md`
- `CODEX_WEBSITE_HARDENING_AND_DOCKER_TASK.md`
- `docs/BRANCH_AND_DELIVERY_PLAN.md`
- `docs/ENHANCED_FEATURES_AND_BRANCHES.md`
- `docs/API_FORM_CTA_CONTRACT.md`

## Preflight

Print repository, remote, current directory, branch, starting SHA, git status, Node version, Corepack version and pnpm version. Confirm this branch contains planning SHA `bb23e7c4340dd2a848aec171f510b13396db0726` or a later reviewed planning ancestor.

## Required implementation

- Nuxt 4, Vue 3 and TypeScript scaffold.
- Node 22 active-LTS-compatible configuration.
- Corepack/pnpm with committed `pnpm-lock.yaml`.
- Strict TypeScript and lint configuration.
- Original Klyrow design tokens for color, typography, spacing, radius, shadow and motion.
- Responsive application shell.
- Skip link.
- Accessible desktop header and mega-menu primitives.
- Accessible mobile navigation drawer with escape close, focus management and scroll lock.
- Footer and locale switcher primitives.
- Reusable button, link, field, select, textarea, checkbox, radio, card, accordion, tabs, modal/dialog, drawer, toast, alert, badge, breadcrumb and section components.
- CTA rendering component driven by typed definitions; use fixtures only in this branch.
- Loading, empty, error, permission/configuration unavailable and offline UI states.
- Reduced-motion behavior.
- English/Spanish localization framework with sample shell strings.
- Component documentation or examples sufficient for later branches.

## Design rules

- Spacious editorial layout with large typography.
- Strong blue/violet primary identity with controlled cyan, coral, lime and amber accents.
- Accessible neutral surfaces.
- Original work only; do not copy Apple assets, markup, content or distinctive compositions.
- No fabricated customer proof, statistics or claims.
- Mobile-first and usable at 320px width through wide desktop.

## Required tests

- Unit/component tests for every primitive.
- Keyboard tests for menus, drawer, tabs, dialogs and forms.
- Focus restoration and escape behavior.
- axe accessibility tests for representative components.
- Reduced-motion test.
- Locale switcher test.
- Type check, lint and Nuxt production build.
- No OIDC/API/Odoo/n8n/middleware secret or browser-storage use.

## CI

Add only the foundational checks required by this branch. Do not add a production deployment workflow.

## Git delivery

Create logical commits, push only this branch and open/update one draft PR against `planning/production-website-blueprint`. Post exact test/build evidence. Stop after this branch.

## Prohibited

- No production or staging deployment.
- No forms or live APIs.
- No Odoo/n8n/middleware connection.
- No Docker/Caddy changes.
- No secrets.
- No work from later branches.

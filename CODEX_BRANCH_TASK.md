# Codex Branch Task — Localized Content and Route System

## Branch

```text
feat/content-localization-pages
```

## Prerequisite

Recreate or update this branch from the accepted `feat/site-shell-design-system` head before implementation. The current branch contains planning only.

## Objective

Implement the complete data-driven page and localization system: 46 English indexable content pages and 46 complete Spanish equivalents. Do not implement form submission, real APIs, middleware, analytics, Docker or production deployment.

## Required reading

Read all planning documents, especially `docs/SITEMAP_CONTENT_AND_DESIGN.md`, `docs/BRANCH_AND_DELIVERY_PLAN.md` and the design-system PR evidence.

## Preflight

Print directory, remote, branch, starting SHA, accepted prerequisite SHA and git status. Inventory every planned route as `IMPLEMENTED`, `PARTIAL`, `MISSING` or `BLOCKED`.

## Required implementation

- Typed content/page schema.
- Route manifest for all indexable and utility routes.
- 46 unique English indexable pages.
- 46 complete Spanish equivalents under `/es`.
- Complete localized navigation, footer and breadcrumb labels.
- Route-level page templates for home, product, solution, integration, developer, resource, company, pricing placeholder, legal and utility page families.
- Locale-aware internal link helper.
- Language switch preserving equivalent route when available.
- Real 404 component behavior prepared for later SEO branch.
- Legal and utility pages following index/noindex requirements.
- Related-content links on every feature/solution page.
- No raw English fallback visible inside Spanish pages.
- No thin automatic-translation placeholders.
- No fabricated claims, metrics, prices, awards, customers or testimonials.

## Content quality

Each indexable page requires:

- unique purpose and target audience;
- unique H1 and introduction;
- concrete Klyrow capability explanation;
- relevant feature/solution links;
- clear primary and secondary CTA IDs using fixtures from the typed registry contract;
- visible FAQ only when genuinely useful;
- accurate limitations and no ranking/deliverability guarantees.

## Required tests

- Exact route count by locale.
- Every English route has a Spanish equivalent unless explicitly documented.
- No duplicate slugs.
- No missing page title/H1/body/CTA IDs.
- No mixed-language fallback.
- Every internal content link resolves.
- Every page is reachable through ordinary links.
- Legal/utility indexability rules.
- Mobile/tablet/desktop rendering smoke tests for representative templates.
- Type check, lint, unit/component tests and production build.

## Git delivery

Push only this branch, open/update one draft PR against the latest accepted shell baseline, post route-manifest evidence and stop.

## Prohibited

- No live form/API behavior.
- No middleware/Odoo/n8n connection.
- No analytics tags.
- No Docker/Caddy/deployment changes.
- No copied third-party website content.

# Codex Branch Task — Localized Marketing Content and Route System

## Branch

```text
feat/content-localization-pages
```

## Status

```text
FEATURE_STATUS=SCAFFOLDED
APPLICATION_CODE_PRESENT=NO
MARKETING_ROUTES_IMPLEMENTED=NO
LEGAL_DOCUMENTS_IMPLEMENTED=NO
STAGING_CHANGED=NO
PRODUCTION_CHANGED=NO
```

## Prerequisites

Recreate/update this branch from accepted:

```text
refactor/modular-website-architecture
feat/site-shell-design-system
```

The current branch is planning only.

## Objective

Implement the data-driven marketing content and localization system: 46 unique English marketing pages and 46 complete Spanish equivalents.

Create only the reusable legal-page rendering template and route-family interface needed by the later legal branch. Do not write/publish substantive legal documents, cookie consent, privacy request flows, or legal APIs here.

## Required reading

Read:

- `docs/IMPLEMENTATION_STATUS_AND_RELEASE_TRUTH.md`;
- `docs/REPOSITORY_ARCHITECTURE_AND_API_CATALOG.md`;
- `docs/SITEMAP_CONTENT_AND_DESIGN.md`;
- `docs/LEGAL_PRIVACY_COOKIE_COMPLIANCE.md`;
- `docs/BRANCH_AND_DELIVERY_PLAN.md`;
- accepted design-system evidence.

## Preflight

Print directory, remote, branch, starting SHA, accepted prerequisite SHAs, and git status. Inventory every marketing route as `IMPLEMENTED`, `PARTIAL`, `MISSING`, or `BLOCKED`.

## Required implementation

- typed marketing content/page schema in the approved package boundary;
- route manifest for 46 English and 46 Spanish marketing routes;
- complete localized navigation, footer, breadcrumb, related-content, and CTA labels;
- route-level templates for home, platform, audience, feature, integration, developer, resource, company, pricing, and general form-page families;
- reusable `LegalPage` renderer/template accepting typed legal document data, without final legal text or publication policy;
- reusable utility/error page template;
- locale-aware internal-link helper;
- language switch preserving equivalent route when available;
- real 404 component foundation for later SEO branch;
- related-content links on every feature/solution page;
- no visible English fallback inside Spanish pages;
- no thin/machine-placeholder translations;
- no fabricated claims, metrics, prices, awards, customers, certifications, or testimonials.

## Marketing page quality

Each marketing page requires:

- unique purpose and target audience;
- unique H1 and introduction;
- concrete Klyrow capability explanation;
- accurate implemented/planned/optional language;
- relevant feature/solution/integration links;
- clear primary/secondary CTA IDs using typed fixtures;
- FAQ only when useful and visible;
- no ranking, deliverability, legal compliance, or revenue guarantee.

## Legal boundary

This branch may include:

```text
LegalPage component/template
legal route-family type
legal table-of-contents component
legal metadata display primitive
print-style foundation
```

This branch must not include:

```text
final privacy policy
final terms
final cookie inventory
cookie banner/settings
privacy request form/status
DPA/subprocessor data
legal approval state behavior
GPC or analytics script gating
```

Those belong to `feat/legal-privacy-cookie-center`.

## Required tests

- exact 46-route count per locale;
- every English marketing route has a Spanish equivalent;
- no duplicate slugs;
- no missing title/H1/body/CTA IDs;
- no mixed-language fallback;
- every internal marketing link resolves;
- every marketing page is reachable through ordinary links;
- legal renderer works with fixtures but contains no effective legal text;
- representative mobile/tablet/desktop template tests;
- type check, lint, unit/component tests, and production build.

## Git delivery

Push only this branch, update draft PR #5 against the latest accepted shell baseline, post route-manifest evidence, and stop.

## Prohibited

- no substantive legal/cookie/privacy implementation;
- no live form/API behavior;
- no middleware/Odoo/n8n connection;
- no analytics tags;
- no Docker/Caddy/staging/production changes;
- no copied third-party content;
- no claim that 92 marketing routes or any legal route is live.
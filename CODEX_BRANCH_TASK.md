# Codex Branch Task — Feature Pages, Pricing and Conversion

## Branch

```text
feat/feature-pricing-conversion
```

## Prerequisites

Update from accepted `feat/site-shell-design-system` and `feat/content-localization-pages` work before implementation.

## Objective

Deliver the five audience landing experiences, 21 feature pages, pricing and plan comparison surfaces, and a typed CTA registry with zero dead actions. Do not implement form submission APIs or production integrations in this branch.

## Required implementation

- Five distinct landing experiences:
  - developers;
  - marketing teams;
  - agencies/resellers;
  - enterprise teams;
  - Odoo/automation teams.
- 21 dedicated feature pages from the sitemap contract.
- Configuration-driven pricing page.
- Plan comparison table with accessible mobile alternative.
- `Contact sales` mode whenever owner-approved pricing data is absent.
- Use-case selector and migration consultation CTA.
- Hero, contextual mid-page and final CTA bands.
- Accessible, frequency-capped engagement popup.
- Announcement component controlled by configuration.
- Typed CTA registry matching `docs/API_FORM_CTA_CONTRACT.md`.
- Environment-driven sign-in, docs, status and scheduling destinations.
- External-host allowlist.
- Download registry.
- CTA analytics metadata without loading analytics yet.
- No placeholder anchors or actions.

## Conversion rules

- One clear primary CTA per major section.
- No fake urgency, countdowns or fabricated scarcity.
- No invented prices, discounts, customers, testimonials, reviews or guarantees.
- CTA language must match page locale.
- Popup must not show immediately, on legal/success/error routes, or when it blocks small-screen content.
- Reduced-motion and focus-management requirements apply.

## Required validation

CI must fail when:

- a route CTA points to a missing route;
- a form CTA names an unknown form ID;
- an external CTA uses an unapproved host;
- an auth CTA lacks configuration;
- a download is missing;
- a localized label is missing;
- any CTA target is empty, `#`, `javascript:void(0)` or placeholder content.

Use form fixtures only. Real form UI and APIs belong to later branches.

## Required tests

- CTA registry unit and type tests.
- Route existence tests.
- Locale label tests.
- Pricing-without-approved-values behavior.
- Plan comparison keyboard/screen-reader behavior.
- Popup frequency, route exclusion, escape, focus restoration and reduced-motion tests.
- Representative mobile/tablet/desktop browser tests.
- Type check, lint, unit/component tests and production build.

## Git delivery

Push only this branch, open/update one draft PR, post exact CTA coverage and screenshots, then stop.

## Prohibited

- No form submission or middleware calls.
- No real price invention.
- No analytics loader.
- No Docker/Caddy/deployment changes.

# Klyrow Corporate Design System

## Purpose

Klyrow uses a disciplined dark enterprise visual system inspired by the restraint, spacing, contrast and sharp geometry seen on high-end aerospace and infrastructure websites. It does not copy SpaceX or Starlink logos, assets, fonts, source code or page layouts.

This file is the product-design contract for every public Klyrow marketing route and landing page.

## Authoritative palette

| Role | Token | Value |
| --- | --- | --- |
| Primary background | `--surface-primary` | `#080808` |
| Deep background | `--surface-deep` | `#050505` |
| Primary accent | `--brand-primary` | `#FFD700` |
| Primary text | `--text-primary` | `#F7F8FA` |
| Supporting text | `--text-secondary` | `#C9CBD1` |
| Muted text | `--text-muted` | `#979AA2` |
| Surface borders | `--border-subtle` | `#292B30` |

Semantic success and danger tokens are reserved for real system states. Decorative page-specific colors are not allowed.

## Typography

The single UI stack is:

`Inter, "Helvetica Neue", "Segoe UI", Roboto, Arial, sans-serif`

No external font request is required. Headings use tight tracking and strong weight without novelty display fonts. Navigation, labels and CTA text use compact uppercase treatment with deliberate letter spacing.

## Geometry and spacing

- Header: 76px desktop, 70px mobile.
- Interactive target: minimum 44px.
- Default CTA height: 50px.
- Radius scale: 2px, 4px, 6px and 8px only.
- No pill buttons, giant rounded cards or arbitrary page-specific radii.
- Use the shared spacing tokens and the 80rem content container.

## CTA hierarchy

1. `primary`: gold background and dark text. Use once for the dominant action in a section.
2. `secondary`: transparent dark surface with precise border.
3. `quiet`: low-priority account or utility action.
4. `link` / `text`: tertiary inline action.
5. `danger`: destructive action only.

Use `BaseButton` or `AppCta`; do not create page-local button systems.

## Header

The shared fixed header owns the brand, global product navigation, locale control, sign-in route and primary conversion CTA. Pages must not recreate or replace it.

## Footer

The shared footer owns the final conversion section, product/company/legal navigation, locale access and copyright information. Public pages must not create parallel footers.

## Page composition

Every public page renders inside `.marketing-route` through the default layout. A page may choose its own content sequence, but it must inherit the shared typography, colors, spacing, controls, focus behavior, header and footer.

Recommended sequence:

1. decisive hero with one primary outcome;
2. trust/proof or operating principles;
3. product capability sections;
4. evidence, workflow or comparison section;
5. final conversion block;
6. shared footer.

## Motion

Motion is restrained and functional. Use small hover translations or state transitions only. Respect `prefers-reduced-motion`. Avoid parallax, looping decoration and animation that delays comprehension.

## Accessibility

- Visible keyboard focus uses the gold focus token.
- Touch targets are at least 44px.
- Text and controls must preserve AA contrast.
- Semantic headings and landmarks are required.
- Mobile navigation and dialogs must trap/restore focus correctly.
- Do not hide interactive mobile controls in the tab order.

## Governance

`pnpm test:design` is the enforcement command. CI evaluates the complete pushed/PR commit range and blocks new literal colors, page-level fonts, arbitrary palette utilities, pill geometry, inline visual styles, unapproved raw buttons, parallel CSS systems and public pages that bypass the shared shell.

The authoritative implementation files are:

- `apps/web/app/assets/css/corporate-design-system.css`
- `apps/web/app/assets/css/legacy-marketing-normalization.css`
- `apps/web/app/components/base/*`
- `apps/web/app/components/navigation/SiteHeader.vue`
- `apps/web/app/components/navigation/SiteFooter.vue`
- `apps/web/app/layouts/default.vue`
- `scripts/check-design-system.mjs`

# Codex Branch Task — Klyrow Corporate Site Shell and Design Governance

## Branch

`feat/site-shell-design-system`

## Objective

Maintain one production-quality Klyrow visual system for every public marketing and landing page. The reference direction is disciplined dark aerospace/infrastructure presentation: strong contrast, restrained motion, sharp geometry, confident typography and clear conversion hierarchy. Do not copy third-party logos, assets, fonts, source code or page layouts.

## Binding visual contract

- Primary background: `#080808`
- Deep background: `#050505`
- Primary accent: `#FFD700`
- Primary text: `#F7F8FA`
- Supporting text: `#C9CBD1`
- Muted text: `#979AA2`
- Surface border: `#292B30`
- UI font stack: `Inter, "Helvetica Neue", "Segoe UI", Roboto, Arial, sans-serif`
- 76px desktop / 70px mobile fixed header
- 44px minimum interactive target
- 50px default CTA height
- sharp 2–8px radius scale; no pill system

## Required architecture

- `corporate-design-system.css` is the authoritative token/component CSS source.
- `legacy-marketing-normalization.css` is transitional only for older parallel feature branches.
- All public pages remain under the default `.marketing-route` layout with `SiteHeader` and `SiteFooter`.
- CTA variants are primary, secondary, quiet, text/link and danger.
- New pages must use shared base/navigation components rather than create local equivalents.

## Required governance

`pnpm test:design` must fail new design drift across the complete compared commit range. It blocks literal app colors outside the token file, page/component font declarations, inline styles, arbitrary framework palettes, pill geometry, unapproved raw buttons, parallel CSS systems and public pages that bypass the shared shell.

CI must run the design guard before the normal test/build stages and checkout enough history to compare the full range.

## Safety boundary

This branch changes presentation and design governance only. It does not authorize live forms, public API behavior, middleware/Odoo/n8n delivery, analytics activation, Docker/Nginx deployment, staging changes or production changes.

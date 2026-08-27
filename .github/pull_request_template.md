## Scope

Describe the product or engineering change and the routes/components affected.

## Design-system compliance

- [ ] Public pages remain inside the shared `.marketing-route` layout.
- [ ] Shared `SiteHeader` and `SiteFooter` are preserved.
- [ ] CTAs use `BaseButton` or `AppCta` and the approved hierarchy.
- [ ] No page-specific colors, fonts, pill geometry, inline visual styles or parallel CSS system were added.
- [ ] Desktop, tablet and mobile states were checked.
- [ ] Keyboard focus and reduced-motion behavior were checked.
- [ ] `pnpm test:design` passes on the exact head SHA.

## Validation

Record exact typecheck, lint, test, build, accessibility, security and design-guard results. Do not mark a gate passed without exact-head evidence.

# Klyrow Design-System Migration

Klyrow has parallel feature branches for localized content, pricing/conversion, forms, interactive tools, SEO, analytics and performance. When those branches are rebased or merged after the corporate shell, they must converge on this design system instead of retaining branch-local styling.

## Required migration order

1. Rebase the feature branch onto the accepted `feat/site-shell-design-system` lineage.
2. Keep the default layout and `.marketing-route` boundary.
3. Replace page-local colors with corporate tokens.
4. Replace custom buttons/links used as buttons with `BaseButton` or `AppCta`.
5. Replace pill and oversized radii with the 2/4/6/8px radius scale.
6. Remove page-level `font-family` rules and use `--font-ui`.
7. Move reusable visual behavior into a shared base/navigation component instead of duplicating it across pages.
8. Use `legacy-marketing-normalization.css` only as a temporary bridge for already-written parallel pages; new pages may not depend on it.
9. Run `pnpm test:design`, then the normal type/lint/test/build pipeline.
10. Delete the legacy normalization selector when the last dependent page has migrated.

## Pull-request acceptance

A marketing PR is not design-ready unless:

- the design guard passes for the exact head SHA;
- the page renders inside the shared header/footer shell;
- desktop, tablet and mobile layouts preserve the same hierarchy;
- keyboard focus and reduced-motion behavior remain intact;
- the primary action is visually dominant and secondary actions are subordinate;
- no new color/font/radius/button subsystem was introduced.

## What is intentionally not copied

The reference direction borrows discipline, not identity. Do not import or recreate third-party logos, illustrations, fonts, CSS, source code, proprietary imagery or pixel-identical page layouts from SpaceX, Starlink or any other brand.

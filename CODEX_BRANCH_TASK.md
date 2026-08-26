# Codex Branch Task — Site Shell and Design System

## Branch

`feat/site-shell-design-system`

## Objective

Extend the merged modular architecture with the production-quality Klyrow application shell and reusable Vue design system. This branch owns visual foundations only; content, forms, APIs, integrations, analytics and deployment remain in later branches.

## Required implementation

- Nuxt 4/Vue 3 shell under `apps/web`.
- Original Klyrow design tokens for color, typography, spacing, radius, shadow and motion.
- Responsive desktop header, accessible mega menus and mobile drawer.
- Skip link, footer, language switcher, CTA primitive and reusable controls.
- Loading, empty, error, offline and configuration-unavailable states.
- Keyboard, focus, reduced-motion, component and accessibility tests.

## Prohibited

No live forms, public API implementation, legal publication, middleware/Odoo/n8n connection, analytics SDK, Docker, Nginx, staging or production deployment.

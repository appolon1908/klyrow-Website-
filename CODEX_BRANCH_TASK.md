# Codex Branch Task — Interactive Conversion Tools

## Branch

```text
feat/interactive-tools
```

## Prerequisites

Update from accepted conversion, BFF and forms branches before implementation.

## Objective

Build useful, fast and safe interactive tools that improve visitor decision-making without creating real email, billing, Odoo accounting or unrestricted automation side effects.

## Required tools

### Pricing estimate

- Inputs for transactional volume, marketing volume, profiles, seats and reseller interest.
- Uses owner-approved configuration only.
- Returns `configuration_required` and a consultation CTA when approved prices are absent.
- Clearly labeled non-binding estimate when configured.
- Never invents prices or discounts.

### Domain readiness

- Accepts a normalized public domain only.
- Controlled DNS MX/TXT lookups for visible setup guidance.
- SPF/DMARC educational checks.
- DKIM setup guidance without broad selector enumeration.
- Strict DNS timeout, cache and rate limits.
- No arbitrary URL fetch, redirect following or private/internal target control.
- Never guarantees inbox placement or deliverability.

### API sandbox

- Uses fixtures or approved test service only.
- Never sends real email.
- Generates copyable curl, JavaScript/TypeScript, Python and PHP examples with placeholder keys.
- Shows request/response validation and stable problem examples.

### Migration chooser

- Guided provider/volume/domain/template/suppression/timeline questions.
- Ends in the registered migration-consultation form.

### Content search

- Static/client-safe index of public website content.
- Keyboard-accessible results.
- Lazy loaded.
- No private data or remote arbitrary search backend required.

### Scheduling handoff

- Uses an approved environment-configured public scheduling URL or falls back to contact sales.
- Enforces external host allowlist.
- No embedded secret or unapproved third-party script.

## Performance rules

- Tools are code split and lazy loaded.
- No tool blocks initial home/pricing route rendering.
- No heavy chart or animation library unless measured and justified.
- Respect reduced motion.
- Abort abandoned requests.
- Enforce body, rate, time and resource limits.

## Required tests

- Pricing unavailable/configured behavior.
- No invented value fallback.
- Domain normalization and invalid/private/internal inputs.
- DNS timeout/cache/rate-limit behavior.
- No arbitrary URL request.
- API sandbox has zero real side effects.
- Migration chooser-to-form integration.
- Search keyboard and screen-reader behavior.
- Scheduling host allowlist/fallback.
- Lazy-loading and representative bundle evidence.
- Mobile/desktop Playwright and axe tests.
- Type check, lint, unit/integration tests and production build.

## Git delivery

Push only this branch, open/update one draft PR and post measured tool/bundle/safety evidence. Stop before SEO/analytics/deployment.

## Prohibited

- No real email send.
- No real billing.
- No direct Odoo/n8n calls.
- No arbitrary URL fetch/internal network probe.
- No Docker/Caddy/production changes.

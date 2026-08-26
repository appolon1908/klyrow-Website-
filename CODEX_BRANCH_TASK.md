# Codex Branch Task — Forms and Conversion Engine

## Branch

```text
feat/forms-conversion-engine
```

## Prerequisites

Update from accepted `feat/feature-pricing-conversion` and `feat/public-api-bff` work before implementation.

## Objective

Build every public form and its accessible conversion behavior against the same-origin `/api/v1` BFF. Use the BFF's mocked durable adapter until the middleware integration branch.

## Registered forms

```text
request-demo
contact-sales
pricing-consultation
developer-interest
partner-application
migration-consultation
support-contact
newsletter
```

## Required implementation

- Reusable typed form engine and field components.
- Form schemas matching `docs/API_FORM_CTA_CONTRACT.md`.
- Client convenience validation plus authoritative server validation.
- Email and phone normalization.
- Service-contact consent separated from marketing consent.
- Landing page, referrer, locale and approved UTM capture.
- Idempotency key generation and safe retry reuse.
- Request/submission ID display for support correlation.
- Honeypot and minimum-completion-time controls.
- Optional CAPTCHA provider adapter with disabled/test states.
- Accessible error summary and field errors.
- Pending/disabled state preventing accidental duplicate clicks.
- Accepted, duplicate-accepted, validation, rate-limited, CAPTCHA, middleware-unavailable and retryable-failure states.
- Preserve non-sensitive values after retryable failure.
- Clear post-submit next actions.
- Newsletter double-opt-in informational state when configured.
- CTA registry integration for all form CTAs.
- No secret collection; warn users not to submit passwords/API keys/payment credentials.

## Endpoint mapping

```text
request-demo             -> POST /api/v1/leads/demo
contact-sales            -> POST /api/v1/leads/sales
pricing-consultation     -> POST /api/v1/leads/pricing
developer-interest       -> POST /api/v1/leads/developer-interest
partner-application      -> POST /api/v1/leads/partner-application
migration-consultation   -> POST /api/v1/leads/migration-consultation
support-contact          -> POST /api/v1/support/contact
newsletter               -> POST /api/v1/subscriptions/newsletter
```

## Accessibility requirements

- Associated labels and descriptions.
- Logical tab/focus order.
- Error summary receives focus after failed submission.
- Field errors connected with `aria-describedby`.
- Status updates announced through appropriate live regions.
- Keyboard-complete custom fields.
- 200% zoom and mobile viewport usability.
- No validation conveyed by color alone.

## Required tests

- Every form renders in English and Spanish.
- Required/optional validation.
- Normalization.
- Consent separation.
- Idempotency reuse on retry.
- Duplicate accepted result.
- Rate-limited and retryable failure behavior.
- Honeypot/timing/CAPTCHA states.
- CTA-to-form mapping.
- No false success on mocked persistence failure.
- No sensitive fields in analytics/log fixtures.
- Keyboard and axe checks.
- Playwright successful and failed submission flows on mobile and desktop.
- Type check, lint, unit/component/API integration tests and production build.

## Git delivery

Push only this branch, open/update one draft PR and post exact form/CTA/API coverage. Stop before real middleware/Odoo/n8n integration.

## Prohibited

- No direct Odoo/n8n calls.
- No production middleware credential.
- No real billing or email activation.
- No Docker/Caddy/deployment changes.

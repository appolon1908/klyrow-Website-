# Codex Branch Task — Shared Forms and Conversion Engine

## Branch

```text
feat/forms-conversion-engine
```

## Status

```text
FEATURE_STATUS=SCAFFOLDED
APPLICATION_CODE_PRESENT=NO
REGISTERED_FORMS_IMPLEMENTED=NO
STAGING_CHANGED=NO
PRODUCTION_CHANGED=NO
```

## Prerequisites

Before implementation, recreate/update this branch from accepted:

```text
refactor/modular-website-architecture
feat/site-shell-design-system
feat/feature-pricing-conversion
feat/public-api-bff
```

## Objective

Build one reusable, typed, accessible form engine for sales, support, legal, privacy, security, abuse, and subscription flows against the same-origin `/api/v1` BFF.

Use the BFF's mocked durable adapter until the middleware integration branch. Do not create separate one-off form implementations inside legal pages or feature pages.

## Registered form catalog

### Commercial and product

```text
request-demo
contact-sales
pricing-consultation
developer-interest
partner-application
migration-consultation
```

### Support and security

```text
support-contact
security-consultation
security-report
abuse-report
```

### Legal and privacy

```text
dpa-request
privacy-request
privacy-opt-out
```

### Subscriptions

```text
newsletter
subprocessor-updates
legal-updates
```

The later legal/privacy branch owns page placement, legal notices, publication state, cookie consent UI, and privacy-status presentation. This branch owns the reusable form engine, schemas, API adapters, and shared accessible behavior.

## Required implementation

- reusable typed form engine and field components;
- one registry mapping form ID, schema, endpoint, purpose, consent requirements, locale text keys, rate class, and success behavior;
- schemas from shared contracts;
- client convenience validation plus authoritative server validation;
- email/phone/URL normalization without automatic URL fetching;
- service-contact, marketing, legal-terms, and update-subscription consent kept separate;
- landing page, referrer, locale, and approved UTM capture where applicable;
- idempotency-key generation and safe retry reuse;
- request/submission ID display for support correlation;
- honeypot and minimum-completion-time controls;
- optional CAPTCHA adapter with disabled/test states;
- accessible error summary and field errors;
- pending/disabled behavior preventing accidental duplicate clicks;
- accepted, duplicate-accepted, validation, rate-limited, CAPTCHA, dependency-unavailable, and retryable-failure states;
- preserve only non-sensitive values after retryable failure;
- clear next actions;
- double-opt-in informational state when configured;
- CTA registry integration;
- warning not to submit passwords, API keys, private keys, payment credentials, or live security credentials;
- privacy/security/abuse free-text excluded from analytics and general logs.

## Endpoint mapping

```text
request-demo             -> POST /api/v1/leads/demo
contact-sales            -> POST /api/v1/leads/sales
pricing-consultation     -> POST /api/v1/leads/pricing
developer-interest       -> POST /api/v1/leads/developer-interest
partner-application      -> POST /api/v1/leads/partner-application
migration-consultation   -> POST /api/v1/leads/migration-consultation
dpa-request              -> POST /api/v1/leads/dpa-request
security-consultation    -> POST /api/v1/leads/security-consultation
support-contact          -> POST /api/v1/support/contact
security-report          -> POST /api/v1/security/report
abuse-report             -> POST /api/v1/abuse/report
privacy-request          -> POST /api/v1/privacy/requests
privacy-opt-out          -> POST /api/v1/privacy/opt-out
newsletter               -> POST /api/v1/subscriptions/newsletter
subprocessor-updates     -> POST /api/v1/subscriptions/subprocessor-updates
legal-updates            -> POST /api/v1/subscriptions/legal-updates
```

## Data minimization

Each form defines its own allowlisted fields. Do not use one giant common payload containing irrelevant fields.

Examples:

- newsletter requires email, topics, locale, marketing consent, and policy version;
- privacy request collects minimum intake/contact/request type, not identity documents by default;
- abuse/security reports accept bounded descriptions and safe reference fields but no active credentials;
- DPA request collects company/contact and commercial context, not executed-agreement assertions;
- partner form validates `website_url` but never fetches it.

## Consent rules

- service contact does not imply marketing consent;
- marketing boxes are not prechecked;
- newsletter requires explicit marketing consent;
- subprocessor/legal update subscriptions are distinct from general marketing;
- privacy/abuse/security requests do not require marketing consent;
- legal acceptance captures document ID/version only where genuinely required;
- client timestamp is informational; server receipt is authoritative.

## Accessibility requirements

- associated labels/descriptions;
- logical tab/focus order;
- error summary receives focus after failure;
- field errors connected via `aria-describedby`;
- live status updates;
- keyboard-complete custom fields;
- 200% zoom and 320px usability;
- no color-only status;
- safe focus after accepted/duplicate/rate-limited/retryable outcomes;
- English/Spanish completeness.

## Security/privacy

- no direct Odoo/n8n/middleware calls from browser components;
- no raw form body in logs/analytics;
- no CAPTCHA token logging;
- no sensitive data in URLs;
- body/field length limits;
- origin/CSRF and rate limits supplied by BFF;
- no file uploads in this branch;
- no arbitrary URL fetch;
- privacy status tokens not handled by generic form state.

## Required tests

- every registered form renders using fixtures in English and Spanish;
- every form ID maps to exactly one endpoint/schema/purpose;
- required/optional validation and normalization;
- consent separation and no prechecked marketing;
- idempotency reuse on retry;
- duplicate accepted result;
- rate-limited/retryable/dependency failure behavior;
- honeypot/timing/CAPTCHA states;
- CTA-to-form mapping;
- no false success on mocked persistence failure;
- data-minimization snapshots per form;
- no sensitive fields in logs/analytics fixtures;
- keyboard/axe checks;
- Playwright successful and failed flows on mobile/desktop;
- type check, lint, unit/component/API integration tests, and production build.

## Git delivery

Push only this branch, update draft PR #8 with exact form/CTA/API coverage, and stop before `feat/legal-privacy-cookie-center` or real middleware/Odoo/n8n integration.

## Prohibited

- no final legal-page publication or cookie settings;
- no direct Odoo/n8n calls;
- no production middleware credential;
- no real deletion, billing, email, or legal agreement execution;
- no Docker/Caddy/staging/production changes;
- no claim that forms are live.
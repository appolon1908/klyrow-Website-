# Codex Branch Task — Consent-Aware Analytics and Attribution

## Branch

```text
feat/analytics-consent
```

## Status

```text
FEATURE_STATUS=SCAFFOLDED
APPLICATION_CODE_PRESENT=NO
ANALYTICS_ACTIVE=NO
STAGING_CHANGED=NO
PRODUCTION_CHANGED=NO
```

## Prerequisites

Before implementation, recreate/update this branch from accepted:

```text
feat/feature-pricing-conversion
feat/forms-conversion-engine
feat/legal-privacy-cookie-center
```

Read the legal/privacy cookie contract and existing consent implementation before editing.

## Objective

Add optional, environment-configured, privacy-respecting analytics and attribution by consuming the single consent/category gate created by `feat/legal-privacy-cookie-center`.

Do not create a second cookie banner, second preference store, separate consent cookie, or competing category model.

## Required implementation

- consume the existing legal/cookie consent state and adapter interface;
- GTM/GA4 adapter loaded only when configured and permitted by category/applicability policy;
- no tracking identifiers hard-coded in source;
- approved typed event dictionary;
- CTA, pricing, form, locale, resource, popup, consent, and interactive-tool events;
- UTM normalization and attribution handoff to forms/middleware;
- privacy-safe first-party request/submission correlation where approved;
- development/test traffic labeling or exclusion;
- sensitive-value redaction/filtering;
- consent change, withdrawal, reset, and GPC-driven update behavior;
- analytics adapter unload/disable behavior where technically supported;
- optional analytics failure never breaks navigation, forms, legal pages, cookie settings, or tools;
- category/provider registration in the shared cookie/storage registry.

## Approved events

```text
page_view
cta_click
pricing_plan_view
pricing_cta_click
form_start
form_validation_error
form_submit
form_submit_success
form_submit_failure
language_change
resource_download
outbound_link
video_play
popup_view
popup_submit
tool_start
tool_complete
tool_failure
consent_update
consent_withdraw
cookie_settings_open
privacy_request_start
privacy_request_success
```

## Payload rules

Never send:

- passwords, API keys, tokens, or authorization headers;
- complete email addresses or phone numbers;
- free-form support/demo/privacy/security/abuse message bodies;
- CAPTCHA tokens;
- full IP addresses;
- cookie consent IDs unless explicitly approved and purpose-limited;
- middleware/Odoo/n8n identifiers not approved for analytics;
- privacy-request public tokens;
- sensitive customer/product data;
- legal evidence or document acceptance proof beyond approved document ID/version events.

Prefer anonymous aggregate events. Any pseudonymous identifier requires documented purpose, retention, configuration, and tests.

## Consent integration requirements

- necessary-only startup in strict mode;
- no optional analytics network request before analytics permission;
- no analytics script inserted merely because the banner rendered;
- reject and GPC opt-out prevent analytics initialization when applicable;
- changing preferences updates future event behavior immediately;
- no separate consent persistence;
- analytics technology appears in the cookie policy inventory automatically;
- registry duration/provider/purpose matches runtime configuration;
- consent mode and region/applicability logic remain owned by the legal/cookie module.

## Required tests

- no optional analytics request before permission;
- no analytics after reject/GPC opt-out in configured strict mode;
- analytics loads after consent;
- withdrawal/reset stops future events and disables adapter where supported;
- no duplicate banner/preference state/store;
- no hard-coded tracking IDs;
- event schema validation;
- CTA/form/tool/legal events use non-sensitive payloads;
- sensitive-value filters;
- UTM normalization and allowlist;
- analytics provider failure does not break the site;
- cookie registry includes configured analytics technologies;
- English/Spanish settings integration;
- keyboard/axe/browser/network tests;
- type check, lint, unit/integration tests and production build.

## Git delivery

Push only this branch, update draft PR #12 with browser/network evidence showing consent behavior, registry integration, and payload safety. Stop before performance/Docker/deployment.

## Prohibited

- no second consent system;
- no marketing/analytics tracker before permission when required;
- no raw form/privacy/legal payload analytics;
- no direct Odoo/n8n integration changes;
- no Docker/Caddy/staging/production changes;
- no claim that analytics or cookie compliance is live.
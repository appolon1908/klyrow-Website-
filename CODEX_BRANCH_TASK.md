# Codex Branch Task — Consent-Aware Analytics and Attribution

## Branch

```text
feat/analytics-consent
```

## Prerequisites

Update from accepted conversion and forms branches before implementation.

## Objective

Add privacy-respecting, optional and environment-configured analytics without leaking form contents or loading optional marketing tracking before required consent.

## Required implementation

- Consent state model and persistence policy.
- Consent banner/settings UI when required by configured policy.
- Necessary/analytics/marketing categories as applicable.
- GTM/GA4 adapter loaded only when configured and permitted.
- No tracking identifiers hard-coded in source.
- Approved event dictionary and typed event payloads.
- CTA, pricing, form, locale, resource, popup and interactive-tool events.
- UTM normalization and attribution handoff to forms/middleware.
- First-party request/submission IDs for operational correlation without exposing sensitive payloads.
- Development/test traffic labeling or exclusion.
- Sensitive-value redaction/filtering.
- Consent change and revocation behavior.
- Optional analytics failure must not break the website or forms.

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
```

## Privacy restrictions

Never send:

- passwords or API keys;
- complete phone numbers;
- free-form support/demo message bodies;
- CAPTCHA tokens;
- authorization headers;
- middleware/Odoo/n8n identifiers not approved for analytics;
- sensitive customer/product data.

Avoid complete email addresses. Prefer no email-derived identifier; any approved pseudonymous identifier requires documented policy and tests.

## Required tests

- No optional analytics request before consent when required.
- Analytics loads after consent and stops/updates after revocation as supported.
- No hard-coded tracking IDs.
- Event schema validation.
- CTA/form/tool events use non-sensitive payloads.
- Sensitive-value filter tests.
- UTM normalization.
- Analytics provider failure does not break navigation/forms.
- English/Spanish consent UI.
- Keyboard/axe/browser tests.
- Type check, lint, unit/integration tests and production build.

## Git delivery

Push only this branch, open/update one draft PR and post browser/network evidence showing consent behavior and payload safety. Stop before performance/Docker/deployment.

## Prohibited

- No advertising/marketing tracker before consent when required.
- No raw form payload analytics.
- No direct Odoo/n8n integration changes.
- No Docker/Caddy/production changes.

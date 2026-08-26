# Klyrow Website — Public API, Form and CTA Contract

## 1. Purpose

This file is the authoritative contract for every public website call to action, form and same-origin API. It prevents dead buttons, disconnected forms, inconsistent endpoints and browser-to-Odoo/n8n coupling.

## 2. API conventions

Base path:

```text
/api/v1
```

All JSON responses include:

```json
{
  "request_id": "req_...",
  "status": "accepted",
  "received_at": "2026-08-26T00:00:00Z"
}
```

Externally visible writes also return either `submission_id` or `operation_id`.

Required headers:

```text
X-Request-ID: optional inbound; generated when absent
Idempotency-Key: required for all POST lead/subscription/support operations
Content-Type: application/json
Accept: application/json
```

Errors use `application/problem+json`:

```json
{
  "type": "https://klyrow.com/problems/validation-error",
  "title": "We could not submit this form",
  "status": 422,
  "code": "VALIDATION_ERROR",
  "detail": "Review the highlighted fields.",
  "request_id": "req_...",
  "errors": [
    {"field": "email", "code": "INVALID_EMAIL"}
  ]
}
```

Never return stack traces, provider credentials, middleware URLs, Odoo model internals, n8n webhook addresses or raw upstream bodies.

## 3. Endpoint registry

### Public configuration

```text
GET /api/v1/public/config
```

Returns only safe public values:

- locale support;
- sign-in URL;
- documentation URL;
- status URL;
- approved scheduling provider public URL when configured;
- pricing mode (`contact_sales` or `configured`);
- CAPTCHA public site key when enabled;
- analytics capability flags without secret IDs;
- feature flags safe for public disclosure.

Do not expose private runtime configuration.

### Health

```text
GET /api/v1/health
GET /api/v1/ready
```

`health` proves the process is running. `ready` proves required configuration and the local server path are ready; it may report middleware dependency state without leaking credentials.

### Lead forms

```text
POST /api/v1/leads/demo
POST /api/v1/leads/sales
POST /api/v1/leads/pricing
POST /api/v1/leads/developer-interest
POST /api/v1/leads/partner-application
POST /api/v1/leads/migration-consultation
```

### Support and subscriptions

```text
POST /api/v1/support/contact
POST /api/v1/subscriptions/newsletter
```

### Interactive tools

```text
POST /api/v1/tools/pricing-estimate
POST /api/v1/tools/domain-readiness
POST /api/v1/tools/api-sandbox
```

Tool endpoints never trigger real email sending, billing, Odoo accounting or unrestricted n8n execution.

## 4. Common form envelope

Every form uses this common envelope:

```json
{
  "form_id": "request-demo",
  "form_version": "1",
  "locale": "en",
  "submitted_at_client": "2026-08-26T00:00:00Z",
  "page": {
    "path": "/demo",
    "referrer": "",
    "utm_source": "",
    "utm_medium": "",
    "utm_campaign": "",
    "utm_term": "",
    "utm_content": ""
  },
  "contact": {
    "first_name": "",
    "last_name": "",
    "email": "",
    "phone": "",
    "company": "",
    "job_title": "",
    "country": ""
  },
  "consent": {
    "service_contact": true,
    "marketing": false,
    "policy_version": "website-privacy-v1"
  },
  "fields": {},
  "anti_abuse": {
    "honeypot": "",
    "started_at": "2026-08-26T00:00:00Z",
    "captcha_token": ""
  }
}
```

The server derives the client IP, user agent class, request ID and server receipt time. Do not trust client-supplied IP or authoritative timestamps.

## 5. Form-specific fields

### Request demo

```text
use_case
monthly_volume_range
team_size_range
current_provider
preferred_contact_method
preferred_time_zone
notes
```

Required: name, work email, company, use case, service-contact consent.

### Contact sales

```text
company_size_range
monthly_volume_range
products_interested
country_or_region
notes
```

### Pricing consultation

```text
monthly_transactional_volume
monthly_marketing_volume
profile_count_range
seat_count_range
reseller_interest
required_integrations
notes
```

Do not calculate a binding quote in the browser.

### Developer interest

```text
primary_language
integration_type
estimated_volume_range
api_or_smtp
sandbox_interest
notes
```

### Partner application

```text
partner_type
customer_count_range
regions
white_label_interest
managed_services
website_url
notes
```

`website_url` is validated as a URL but is never fetched automatically.

### Migration consultation

```text
current_provider
current_volume_range
domains_count_range
templates_count_range
suppression_data_available
desired_timeline
notes
```

### Support/contact

```text
category
subject
message
existing_customer
customer_reference_optional
```

Do not collect passwords, API keys or full payment data. Display a warning not to submit secrets.

### Newsletter

```text
topics
frequency_preference
```

Requires explicit marketing consent and double opt-in when configured.

## 6. Successful form response

```json
{
  "request_id": "req_...",
  "submission_id": "sub_...",
  "status": "accepted",
  "duplicate": false,
  "next_action": "show_success",
  "received_at": "2026-08-26T00:00:00Z"
}
```

Duplicate accepted request:

```json
{
  "request_id": "req_...",
  "submission_id": "sub_original",
  "status": "accepted",
  "duplicate": true,
  "next_action": "show_success",
  "received_at": "2026-08-26T00:00:00Z"
}
```

The user receives success only after durable middleware acceptance or an approved local durable queue. A transient fetch success without durable persistence is not enough.

## 7. Middleware event contract

Website BFF sends a versioned event to Codestra middleware:

```json
{
  "event_id": "evt_...",
  "event_type": "klyrow.website.lead.accepted.v1",
  "occurred_at": "2026-08-26T00:00:00Z",
  "source": "klyrow-website",
  "correlation_id": "req_...",
  "idempotency_key": "...",
  "locale": "en",
  "lead": {},
  "consent": {},
  "attribution": {}
}
```

Supported event types:

```text
klyrow.website.demo.requested.v1
klyrow.website.sales.requested.v1
klyrow.website.pricing.requested.v1
klyrow.website.developer_interest.created.v1
klyrow.website.partner_application.created.v1
klyrow.website.migration_consultation.requested.v1
klyrow.website.support_contact.created.v1
klyrow.website.newsletter_subscription.requested.v1
```

Middleware returns durable acceptance with its own receipt ID. The website stores/returns only safe correlation information.

## 8. Odoo mapping

Odoo is the back-office CRM/support surface. Middleware may map approved events to:

- company/contact partner records;
- CRM leads/opportunities;
- activities and assigned sales teams;
- support/helpdesk tickets;
- marketing consent metadata as a mirror, not the public website authority;
- source, campaign and locale metadata;
- external `submission_id` and `event_id` for deduplication.

No direct website-to-Odoo request is allowed. No direct Odoo database access is allowed.

## 9. n8n automation

n8n may perform:

- internal notifications;
- lead routing;
- reminder scheduling;
- enrichment using approved providers;
- follow-up email requests through approved systems;
- owner/sales alerts;
- dead-letter escalation.

n8n cannot decide authoritative consent, erase leads, change Odoo accounting, grant Klyrow product access or bypass middleware/Klyrow commands.

## 10. CTA registry

Create a typed registry such as:

```ts
interface CtaDefinition {
  id: string
  labelKey: string
  kind: 'route' | 'form' | 'external' | 'download' | 'auth'
  target: string
  analyticsEvent: 'cta_click' | 'pricing_cta_click' | 'resource_download'
  variant: 'primary' | 'secondary' | 'text'
  consentRequired?: boolean
  allowedHosts?: string[]
}
```

Minimum CTA IDs:

```text
nav-sign-in
nav-start-building
nav-request-demo
hero-start-building
hero-request-demo
pricing-contact-sales
pricing-request-consultation
feature-view-docs
feature-request-demo
developer-open-docs
developer-api-interest
partner-apply
enterprise-contact
odoo-automation-consultation
migration-consultation
newsletter-subscribe
support-contact
popup-request-demo
footer-contact-sales
footer-status
footer-docs
```

## 11. CTA-to-route/form matrix

```text
nav-sign-in                       -> auth -> PUBLIC_SIGN_IN_URL
nav-start-building                -> route -> /developers
nav-request-demo                  -> form -> request-demo
hero-start-building               -> route -> /developers
hero-request-demo                 -> form -> request-demo
pricing-contact-sales             -> form -> contact-sales
pricing-request-consultation      -> form -> pricing-consultation
feature-view-docs                 -> external/route -> PUBLIC_DOCS_URL or /developers/docs
feature-request-demo              -> form -> request-demo
developer-open-docs               -> external/route -> PUBLIC_DOCS_URL or /developers/docs
developer-api-interest            -> form -> developer-interest
partner-apply                     -> form -> partner-application
enterprise-contact                -> form -> contact-sales
odoo-automation-consultation      -> form -> migration-consultation
migration-consultation            -> form -> migration-consultation
newsletter-subscribe              -> form -> newsletter
support-contact                   -> form -> support-contact
popup-request-demo                -> form -> request-demo
footer-contact-sales              -> form -> contact-sales
footer-status                     -> external -> PUBLIC_STATUS_URL
footer-docs                       -> external/route -> PUBLIC_DOCS_URL or /developers/docs
```

No CTA target may be silently `#`, empty, `javascript:void(0)` or a placeholder in production.

## 12. Interactive tool contracts

### Pricing estimate

Input:

```text
transactional volume range
marketing volume range
profile range
seat range
reseller flag
```

Return one of:

- `configuration_required` when approved prices are absent;
- non-binding estimate range when approved pricing configuration exists;
- CTA to pricing consultation.

Never invent price values.

### Domain readiness

Input: a normalized domain name only.

Allowed operations:

- DNS MX query;
- DNS TXT query for visible SPF/DMARC guidance;
- safe DKIM selector guidance without broad enumeration;
- no arbitrary URL request;
- no internal/private resolver target control;
- strict timeout/cache/rate limit.

Return educational readiness, not a guarantee of deliverability.

### API sandbox

- Uses test fixtures or an approved sandbox service only.
- Never sends real email.
- Never exposes credentials.
- Generates copyable curl/JavaScript/Python examples with placeholder keys.

## 13. Status codes

```text
200 successful tool/config operation
202 durable form acceptance
400 malformed request
403 origin/CSRF denied
409 idempotency conflict with different payload
413 body too large
422 validation error
429 rate limited
503 required dependency/configuration unavailable
```

## 14. Test requirements

Automated tests must cover:

- every CTA ID resolves;
- every route target exists;
- every form ID maps to exactly one API endpoint;
- every localized CTA label exists;
- no placeholder CTA target ships;
- validation and normalization;
- idempotent duplicate response;
- idempotency conflict;
- CSRF/origin denial;
- honeypot and timing rejection;
- rate limits;
- middleware timeout/rejection/durable acceptance;
- problem response schema;
- request ID propagation;
- no sensitive fields in logs/analytics;
- Odoo/n8n contract fixtures;
- keyboard and screen-reader form behavior;
- browser success and retryable-failure paths.

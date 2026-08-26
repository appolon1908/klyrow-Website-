# Klyrow Website — Forms, Middleware, Odoo and n8n Contract

## 1. Fixed boundary

```text
Browser
  -> Nuxt same-origin server API
  -> authenticated Codestra middleware ingress
  -> durable middleware inbox/outbox
  -> Odoo 19 back office
  -> optional non-authoritative n8n workflows
  -> result/reconciliation records
```

The website must never call Odoo or n8n directly from browser JavaScript.

The website repository must never contain:

- Odoo API keys;
- Odoo database names when treated as secret operational data;
- n8n credentials or production webhook URLs;
- middleware service credentials;
- Keycloak secrets;
- Postal credentials;
- private TLS keys.

## 2. Website API endpoints

Implement versioned same-origin endpoints:

```text
GET  /api/v1/health
GET  /api/v1/ready
POST /api/v1/leads/demo
POST /api/v1/leads/contact
POST /api/v1/leads/pricing
POST /api/v1/leads/signup-interest
POST /api/v1/leads/partner
POST /api/v1/leads/support
POST /api/v1/newsletter/subscriptions
POST /api/v1/consent/events
```

All POST endpoints return a consistent envelope:

```json
{
  "submission_id": "sub_...",
  "request_id": "req_...",
  "status": "accepted",
  "next": "/thank-you/demo"
}
```

Validation failures use RFC 7807-style problem details with stable field codes. Retryable middleware failures return an honest 503 or 502 with a retryable code. Do not return success until durable middleware persistence has been acknowledged.

## 3. Common request fields

Typed, validated and normalized common fields:

```text
first_name
last_name
work_email
company_name
job_title
phone
country_code
preferred_language
message
website
expected_monthly_email_volume
primary_use_case
product_interests[]
requested_plan
budget_range
partner_type
consent_to_contact
consent_to_marketing
privacy_policy_version
source_url
referrer_url
utm_source
utm_medium
utm_campaign
utm_content
utm_term
gclid (optional and policy-controlled)
client_generated_idempotency_key
form_started_at
form_submitted_at
honeypot
```

Rules:

- collect only fields required by the specific form;
- never require marketing consent for a service/demo response;
- store service-contact and marketing consent separately;
- normalize email to lowercase after Unicode/domain validation;
- normalize phone to E.164 only when country context makes it possible;
- reject control characters and oversized values;
- remove HTML from ordinary text fields;
- permit no arbitrary file uploads at launch;
- use an allowlist for `next` and redirect paths;
- never place form values in GET query strings.

## 4. Per-form contract

### Demo request

Endpoint:

```text
POST /api/v1/leads/demo
```

Required:

```text
first_name
last_name
work_email
company_name
primary_use_case
expected_monthly_email_volume
consent_to_contact
privacy_policy_version
```

Optional:

```text
phone
job_title
country_code
product_interests[]
message
```

Odoo intent:

- upsert a company/contact mapping where policy permits;
- create or update a `crm.lead`/opportunity through the middleware adapter;
- assign source `klyrow_website_demo`;
- include page, locale and UTM attribution;
- create a follow-up activity when configured.

n8n intent:

- notify the configured sales channel;
- send an acknowledgement email through an approved Klyrow transactional path;
- schedule reminder/escalation if no owner is assigned;
- never mark the lead won or alter billing.

### General contact

Endpoint:

```text
POST /api/v1/leads/contact
```

Categories:

```text
sales
technical
billing
partnership
privacy
press
other
```

Route sales and partnership to CRM. Route privacy to a controlled privacy workflow. Route technical/billing only to support when the public form is approved for those categories. Never include confidential account data in a public contact form.

### Pricing consultation

Endpoint:

```text
POST /api/v1/leads/pricing
```

Capture message volume, use case, team size and requested plan. Do not calculate or promise unapproved prices. Create an Odoo CRM opportunity or activity with source `klyrow_website_pricing`.

### Signup interest

Endpoint:

```text
POST /api/v1/leads/signup-interest
```

This is not a production account-creation API unless the Klyrow platform has explicitly enabled public signup. Until then it records interest and routes to CRM/onboarding automation.

Do not create a Keycloak account, Postal credential or Klyrow tenant from the marketing website task unless a separately reviewed API contract exists.

### Partner application

Endpoint:

```text
POST /api/v1/leads/partner
```

Capture partner type, company, website, countries served, expected customer count and relevant experience. Route to an Odoo reseller/partner opportunity or tagged CRM lead. Do not automatically grant reseller permissions.

### Support/general request

Endpoint:

```text
POST /api/v1/leads/support
```

At public launch, restrict to pre-sales/general assistance unless authenticated customer support is available. Do not let the public form expose customer records. Create a support ticket only through middleware when the Odoo Helpdesk mapping exists.

### Newsletter

Endpoint:

```text
POST /api/v1/newsletter/subscriptions
```

Requirements:

- explicit marketing consent;
- consent timestamp, locale, source URL and policy version;
- double opt-in when configured;
- idempotent subscription behavior;
- generic response that does not disclose whether an email already exists;
- no marketing send until consent requirements are satisfied.

## 5. Website lead event envelope

The Nuxt server sends a signed request to the middleware using a versioned envelope:

```json
{
  "schema": "com.klyrow.website.lead.v1",
  "event_id": "evt_...",
  "submission_id": "sub_...",
  "request_id": "req_...",
  "idempotency_key": "...",
  "occurred_at": "2026-08-26T00:00:00Z",
  "source": "klyrow-website",
  "environment": "production",
  "form_type": "demo",
  "locale": "en",
  "page": "https://klyrow.com/demo",
  "attribution": {
    "referrer": "...",
    "utm_source": "...",
    "utm_medium": "...",
    "utm_campaign": "...",
    "utm_content": "...",
    "utm_term": "..."
  },
  "consent": {
    "contact": true,
    "marketing": false,
    "policy_version": "2026-08-26",
    "recorded_at": "2026-08-26T00:00:00Z"
  },
  "lead": {
    "first_name": "...",
    "last_name": "...",
    "work_email": "...",
    "company_name": "..."
  }
}
```

The middleware is responsible for:

- authenticating the website service;
- verifying signature/timestamp and replay window;
- enforcing schema and size limits;
- writing the event durably before acknowledgement;
- deduplicating by source + idempotency key;
- assigning a correlation ID;
- processing Odoo/n8n deliveries asynchronously;
- recording each attempt and result;
- exposing an operational status or reconciliation surface.

## 6. Service authentication

Preferred order:

1. mTLS between website runtime and middleware when network placement allows;
2. signed HMAC request using a secret file/manager plus timestamp and body digest;
3. short-lived service token issued through the approved identity boundary.

Do not use a long-lived credential in public runtime configuration.

Headers may include:

```text
X-Klyrow-Request-ID
X-Klyrow-Event-ID
X-Klyrow-Timestamp
X-Klyrow-Signature
Idempotency-Key
Content-Type: application/json
```

The exact production mechanism must be aligned with the existing middleware rather than creating a conflicting second authentication system.

## 7. Odoo 19 mapping

Use the middleware's Odoo adapter. For Odoo 19, prefer the supported JSON-2 external API or an approved custom module/controller when available. Do not use direct database writes.

Possible models, subject to installed modules and field discovery:

```text
res.partner
crm.lead
mail.activity
helpdesk.ticket
utm.source
utm.medium
utm.campaign
```

Codex must inspect the actual Odoo database schema/model documentation endpoint and installed modules before mapping custom fields.

Recommended external mapping table in middleware/Klyrow:

```text
source_system
source_record_type
source_record_id
odoo_model
odoo_record_id
odoo_database_reference
last_synced_version
last_synced_at
sync_status
last_error_code
```

Do not use email address as the sole immutable cross-system identity. Use submission IDs and maintained mappings.

## 8. n8n workflow rules

n8n may:

- notify sales/support teams;
- send internal alerts;
- call approved Klyrow APIs;
- enrich a lead using approved providers;
- create follow-up activities through middleware;
- send consent-compliant acknowledgement messages;
- schedule reminders and escalations;
- synchronize non-authoritative workflow status.

n8n must not:

- write directly to Odoo or Klyrow databases;
- create platform-owner privileges;
- create production email credentials;
- enable live sending;
- change billing entitlements;
- mark payments confirmed;
- bypass consent or suppression;
- become the sole durable record of a submission.

Every workflow must have:

```text
workflow name
version
owner
trigger event
input schema
output/result schema
idempotency behavior
retry policy
timeout
failure route
alert route
PII classification
retention policy
test-mode flag
```

## 9. Failure handling

### Middleware unavailable

- Website API returns a retryable error unless a separately approved local durable queue exists.
- Browser preserves non-sensitive form values in memory and offers retry.
- Do not claim success.
- Emit an operational metric without logging message contents.

### Odoo unavailable

- Middleware retains the accepted event and retries asynchronously.
- Website submission remains accepted because durable middleware storage succeeded.
- Odoo failure is visible to operations and does not require the visitor to resubmit.

### n8n unavailable

- Middleware records the automation failure and retries or dead-letters according to policy.
- Odoo lead creation may continue independently.
- The website does not wait for workflow completion.

### Duplicate form submission

- Return the original submission ID when the same idempotency key and equivalent payload are repeated within the allowed window.
- Reject reuse with a materially different payload.

## 10. Anti-abuse and privacy

Implement:

- per-IP and per-normalized-email rate limits;
- honeypot field;
- minimum human completion time;
- maximum payload sizes;
- optional CAPTCHA adapter;
- origin and content-type validation;
- no CORS wildcard on form APIs;
- block disposable email providers only if policy-approved and with a false-positive path;
- privacy-safe logs;
- configurable retention;
- deletion/export workflow hooks;
- explicit consent records;
- generic public responses that do not enumerate existing records.

## 11. Required tests

### Unit/API

- valid request per form;
- missing/invalid fields;
- Unicode names and domains;
- oversized values;
- malicious HTML/script strings;
- honeypot detection;
- too-fast submission;
- rate limit;
- idempotent replay;
- idempotency conflict;
- invalid origin;
- middleware timeout;
- middleware signature failure;
- middleware durable acceptance;
- retryable error response;
- consent separation;
- no sensitive logging.

### Contract/integration

- website event schema validation;
- middleware deduplication;
- test-mode Odoo partner/lead mapping;
- test-mode n8n trigger and result;
- Odoo outage retry;
- n8n outage retry/dead-letter;
- request/event/submission correlation;
- no direct browser external call;
- no production credentials in bundle or repository.

### Browser/accessibility

- keyboard-complete form;
- screen-reader labels;
- field error association;
- live success/failure announcement;
- focus first invalid field;
- preserve form state on retry;
- no duplicate submit while pending;
- mobile form usability;
- popup form focus trap and restoration.

## 12. Operational metrics

At minimum:

```text
website_form_requests_total{form,status}
website_form_validation_failures_total{form,code}
website_form_rate_limited_total{form}
website_middleware_requests_total{status}
website_middleware_request_duration_seconds
website_submission_accepted_total{form}
website_submission_retryable_failures_total{form}
website_submission_duplicate_total{form}
```

Logs include request ID, submission ID, form type, status, duration and safe error code. Do not log full message, phone number, email address, HMAC material or external credentials.
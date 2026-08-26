# Codex Branch Task — Codestra Middleware, Odoo and n8n Integration

## Branch

```text
feat/middleware-odoo-n8n
```

## Prerequisites

Update from accepted `feat/public-api-bff` and `feat/forms-conversion-engine` work before implementation.

## Objective

Replace the mocked durable adapter with an authenticated, observable and recoverable Codestra middleware client. Route approved website lead/consent events into Odoo and optional non-authoritative n8n workflows through middleware only.

## Required architecture

```text
Nuxt BFF
  -> authenticated Codestra middleware
  -> durable middleware inbox/outbox
  -> Odoo CRM/contact/activity/support adapters
  -> optional n8n notification/routing workflows
```

## Required implementation

- Typed middleware client interface.
- Environment and secret-file validation.
- Approved API-key and/or mTLS client support without printing credentials.
- Request ID, event ID, correlation ID and idempotency propagation.
- Event schemas from `docs/API_FORM_CTA_CONTRACT.md`.
- Bounded connect/read/total timeouts.
- Retry only for safe idempotent requests.
- Exponential backoff with jitter and retry budget.
- Circuit/degraded state behavior.
- Durable-acceptance validation; never show success on an ambiguous or non-durable response.
- Middleware rejection/error mapping to stable public problem codes.
- Privacy-safe structured logs and metrics.
- Odoo mapping fixtures/contracts for company, contact, CRM lead/opportunity, activities and support ticket.
- n8n mapping fixtures/contracts for notifications, routing, reminders and approved enrichment.
- Test-mode integration scripts that create no real invoice, payment, entitlement or live email action.
- External record/correlation mapping documentation.
- Dead-letter and reconciliation runbook.
- Health/readiness dependency state without secret disclosure.

## Event types

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

## Authority boundaries

- Website BFF owns request validation and user response.
- Middleware owns durable cross-system delivery.
- Odoo is the back-office CRM/support surface.
- n8n is non-authoritative automation.
- Consent must not become authoritative in n8n.
- No component may write directly to Odoo PostgreSQL.
- No browser may receive middleware/Odoo/n8n credentials or URLs.

## Required tests

- Authentication/mTLS fixture behavior.
- Secret-file missing/unreadable behavior without value disclosure.
- Durable acceptance.
- Duplicate idempotent acceptance.
- Rejection, timeout and malformed response.
- Retry schedule and no unsafe retry.
- Circuit/degraded behavior.
- Request/event/correlation ID propagation.
- Odoo and n8n contract fixtures.
- Odoo/n8n outage does not lose accepted durable middleware records.
- No real accounting/billing/email side effects in tests.
- No sensitive values in logs.
- Browser success/failure verification through mocked/staging middleware.
- Type check, lint, unit/integration tests and build.

## Git delivery

Push only this branch, open/update one draft PR and provide exact test-mode middleware/Odoo/n8n evidence. Stop before interactive tools or deployment.

## Prohibited

- No direct browser/Odoo/n8n connection.
- No direct Odoo database writes.
- No production workflow activation without approved identifiers.
- No invoice/payment creation.
- No live email sending.
- No Docker/Caddy/production deployment changes.

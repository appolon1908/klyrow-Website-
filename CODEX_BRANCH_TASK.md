# Codex Branch Mission — Website Forms, Middleware, Odoo and n8n

Branch: `feat/website-odoo-n8n-forms`

Before implementation, update/recreate this branch from the reviewed Nuxt marketing-site baseline. Read every blueprint document, especially `docs/FORMS_MIDDLEWARE_ODOO_N8N.md`.

Required:

- same-origin Nuxt `/api/v1` form endpoints;
- typed validation/normalization;
- idempotency, request IDs, CSRF/origin checks and rate limits;
- honeypot, timing and optional CAPTCHA controls;
- durable authenticated Codestra middleware client;
- website lead/consent event schemas;
- accessible demo, contact, pricing, signup-interest, partner, support and newsletter forms;
- honest retryable failure behavior;
- Odoo 19 test-mode contact/CRM mapping through middleware;
- n8n test-mode notification/follow-up contract through middleware;
- metrics, privacy-safe logs and runbook;
- unit, API, integration, browser, accessibility and security tests.

No browser-to-Odoo/n8n calls, direct external database access, production credentials, public Keycloak account creation, Postal provisioning, real invoices, live sends or production deployment.

Push only this branch, open/update one draft PR against the latest reviewed frontend baseline, post exact evidence and stop.
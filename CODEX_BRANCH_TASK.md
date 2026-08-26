# Codex Branch Task — Shared Forms and Conversion Engine

## Branch

`feat/forms-conversion-engine`

## Objective

Build one schema-driven, bilingual and accessible public form engine on top of the reviewed `/api/v1` BFF. Commercial, support, security, abuse, privacy and update-subscription flows must share the same field, validation, attribution, idempotency and status behavior.

## Required implementation

- Typed form registry and exact endpoint mapping.
- Reusable field and form components.
- Client convenience validation with authoritative server validation.
- Contact normalization, consent separation and attribution capture.
- Idempotency-key reuse for safe retries.
- Honeypot, minimum-completion-time and optional CAPTCHA fields.
- Accessible error summary, pending, accepted, duplicate, rate-limited and retryable states.
- No false success before durable BFF acceptance.
- No secrets, direct Odoo/n8n calls, Docker, Nginx, staging or production changes.

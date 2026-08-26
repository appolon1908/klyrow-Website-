# Codex Branch Task — Codestra Middleware, Odoo and n8n Integration

## Branch

`feat/middleware-odoo-n8n`

## Objective

Replace the website BFF’s mock-only delivery boundary with a server-only, authenticated and durable Codestra middleware adapter. Keep Odoo and n8n behind middleware, preserve idempotency/correlation, and retain mock mode for local and CI execution.

## Safety

No browser may call middleware, Odoo or n8n directly. No direct database access, real accounting, live email activation, Docker/Nginx deployment or production mutation is authorized in this branch.

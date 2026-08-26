# Klyrow Website middleware integration

The browser submits only to the Nuxt same-origin `/api/v1` BFF. The BFF validates, assigns request/event/idempotency identifiers and sends a versioned event to the Codestra middleware durable inbox.

```text
Browser -> Nuxt BFF -> authenticated Codestra middleware -> durable inbox/outbox
                                                     -> Odoo CRM/helpdesk/privacy intent
                                                     -> non-authoritative n8n routing/notification intent
```

## Runtime modes

- `mock`: CI and local development. Returns a clearly prefixed mock receipt.
- `http`: server-only HTTP/HTTPS client with bounded retry, circuit breaking, optional bearer credential file and optional mTLS certificate/key/CA files.

The adapter requires a response containing a receipt ID, accepted timestamp and `durable: true`. A network-level success without durable confirmation is treated as failure.

## Production secret files

Configure file paths only; never commit values:

- `NUXT_MIDDLEWARE_API_KEY_FILE`
- `NUXT_MIDDLEWARE_CLIENT_CERT_FILE`
- `NUXT_MIDDLEWARE_CLIENT_KEY_FILE`
- `NUXT_MIDDLEWARE_CA_FILE`

The website does not write Odoo PostgreSQL, call n8n from the browser, post accounting entries or send live email. Middleware adapters translate the declared Odoo/n8n intents and maintain their own replay/dead-letter controls.

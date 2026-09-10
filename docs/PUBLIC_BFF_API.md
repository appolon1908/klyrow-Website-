# Public website API

The `/api/v1` BFF serves public catalog data and explicitly labelled, side-effect-free tools. Account authentication and customer/provider APIs remain owned by `klyrow.com`.

This reconciliation keeps the protected-main Horizon shell and bilingual content. The old draft shell, duplicate navigation/components and outdated conversion behavior are removed. Pricing data is shared from `content/pricing.ts` by the website and public API.

## Availability and contracts

- `/api/v1/health` reports process liveness.
- `/api/v1/ready` returns HTTP 503 until durable Middleware delivery is implemented. A mock receipt never establishes readiness.
- Public configuration uses the existing application-login handoff setting.
- `/api/v1/openapi` returns an OpenAPI 3.1 document with standard `paths`, operation IDs, path/header parameters and JSON request bodies.
- Unregistered paths return 404; unsupported methods return 405 with `Allow`.
- Errors use `application/problem+json` and a bounded `X-Request-ID`.
- JSON write bodies are bounded to 64 KiB while streaming. The local rate limiter expires entries, caps its key count and does not trust arbitrary forwarded IP headers.

## Durable integration remains unavailable

Lead/support/subscription/privacy writes return 503 from the default unavailable adapter. The draft's mock adapter remains a unit-test fixture; the deployed service does not use it. No successful submission is claimed before a validated durable receipt.

Privacy-status lookups return 503 instead of inventing a received state. Cookie-preference writes/reset return 503 instead of claiming that preferences were persisted. Cookie reads expose conservative defaults only. DNS and API sandbox tools remain clearly labelled fixtures; they make no provider calls.

The injectable submission service serializes same-key concurrent requests within one process and validates acceptance receipts. Its in-memory repository and rate limiter are **not** distributed production persistence. Production enablement requires a durable idempotency store, real authenticated Middleware adapter, verified status-token handling and persisted consent with end-to-end tests. There is no configuration switch in this release that silently turns mocks into production delivery.

## Verification

`pnpm typecheck`, `pnpm lint`, `pnpm test` (45 cases), `pnpm build`, `pnpm test:api-smoke` (12 local HTTP checks), `pnpm unused`, dependency audit and secret scan. The existing PR workflow runs typecheck, lint, tests and build; run the additional API smoke command against that build. Tests use only loopback HTTP, generated fixture data and no provider credentials.

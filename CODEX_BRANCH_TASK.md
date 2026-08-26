# Codex Branch Mission — Caddy and Production Operations

Branch: `ops/caddy-production`

Before implementation, update/recreate this branch from all reviewed website feature baselines. Read `docs/CADDY_PRODUCTION_DEPLOYMENT.md` completely.

Required:

- hardened Nuxt/Nitro runtime;
- Docker or systemd implementation selected from actual host audit;
- environment template without secrets;
- health/readiness endpoints;
- staging configuration;
- isolated Caddy site fragment for `klyrow.com` and `www.klyrow.com`;
- HTTPS readiness, apex canonicalization and www redirect;
- compression, immutable asset caching and no-store form APIs;
- security headers aligned with application CSP;
- privacy-safe logs and rotation;
- immutable release layout and current/previous pointers;
- Caddy backup, validation, graceful reload, smoke and rollback scripts;
- website-only monitoring and TLS-expiry checks;
- staging deployment and rollback rehearsal evidence.

Do not overwrite global Caddy config, modify unrelated sites, expose the Nuxt port, restart the full stack, change DNS without authority, commit secrets/private keys or activate the public production domain from this branch.

Push only this branch, open/update one draft PR against the latest reviewed website baseline, attach host/staging evidence and stop.
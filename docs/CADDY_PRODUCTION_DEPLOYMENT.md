# Klyrow Website — Caddy Production Deployment and Rollback

## 1. Production objective

Serve the public Nuxt/Nitro application through the existing Caddy host:

```text
https://klyrow.com
https://www.klyrow.com -> https://klyrow.com
```

Preferred host to inspect:

```text
public IP: 65.109.65.169
private IP: 10.40.0.1
```

Do not assume the hostname, operating system, Caddy layout, service manager, firewall, DNS or existing site configuration. Audit them first.

## 2. Non-negotiable safety rules

- Do not overwrite the global Caddyfile blindly.
- Do not remove or modify unrelated sites.
- Do not reload Caddy until the complete configuration validates.
- Back up the active Caddy configuration before any change.
- Do not develop in the production release directory.
- Do not expose the Nuxt port publicly.
- Do not put production secrets in Git.
- Do not stop Postal, Odoo, Keycloak, n8n, middleware or unrelated applications.
- Do not change DNS automatically unless the exact provider credentials and change authority are explicitly available.
- Do not claim production success until external HTTPS checks pass.

## 3. Required host preflight

Record:

```text
hostname
hostname -I
uname -a
cat /etc/os-release
systemctl status caddy --no-pager
caddy version
caddy environ
caddy validate --config <active-config>
systemctl list-units --type=service --state=running
ss -lntup
firewall status
free -h
df -h
docker ps -a (if Docker is used)
node --version
corepack --version
```

Inspect:

- active Caddy service unit;
- active Caddy config path;
- imports/site fragments;
- existing `klyrow.com` site definitions;
- ports 80/443 ownership;
- upstream port availability;
- log paths and rotation;
- SELinux/AppArmor constraints;
- DNS A/AAAA records;
- public reachability;
- existing certificates and ACME account state.

## 4. DNS preflight

Required before public activation:

```text
klyrow.com A/AAAA -> intended Caddy host
www.klyrow.com A/AAAA or CNAME -> intended host/canonical domain
```

Verify from at least two independent resolvers. Check for stale or conflicting AAAA records. An incorrect AAAA record can cause HTTPS failures even when the A record is correct.

If DNS is absent or wrong, report the exact expected records. Do not fabricate DNS-provider access.

## 5. Runtime architecture

Preferred:

```text
Caddy :80/:443
  -> 127.0.0.1:3100
  -> Nuxt 4 Nitro Node server
```

Nuxt binds only to loopback:

```text
HOST=127.0.0.1
PORT=3100
NODE_ENV=production
```

Same-origin server APIs route through the same Nitro process and then to the authenticated middleware endpoint.

## 6. Release layout

Preferred filesystem structure, adjusted only after host audit:

```text
/srv/klyrow-website/
├── releases/
│   └── <release-sha>/
│       ├── .output/
│       ├── package.json
│       ├── pnpm-lock.yaml
│       ├── RELEASE.json
│       └── checksums.txt
├── current -> releases/<release-sha>
├── previous -> releases/<previous-sha>
└── shared/
    ├── env/production.env
    └── logs/
```

Rules:

- source checkout stays under an isolated Codex/workspace path;
- production release consists of immutable built output and metadata;
- build artifact checksum and source SHA are recorded;
- secrets live in root-readable files or approved secret management, not release directories;
- switch `current` atomically;
- retain at least the previous known-good release;
- do not delete older releases until rollback confidence and retention policy permit.

## 7. Process user and service

Create or use a dedicated unprivileged user such as `klyrow-web` after verifying UID/GID conflicts.

Example systemd service template:

```ini
[Unit]
Description=Klyrow public website
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=klyrow-web
Group=klyrow-web
WorkingDirectory=/srv/klyrow-website/current
EnvironmentFile=/srv/klyrow-website/shared/env/production.env
ExecStart=/usr/bin/node .output/server/index.mjs
Restart=on-failure
RestartSec=5
TimeoutStartSec=30
TimeoutStopSec=30
KillSignal=SIGTERM
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/srv/klyrow-website/shared/logs
RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX
CapabilityBoundingSet=
AmbientCapabilities=
LockPersonality=true
MemoryDenyWriteExecute=true

[Install]
WantedBy=multi-user.target
```

Codex must validate which hardening settings are compatible with the final Nitro runtime. Do not copy this blindly if paths/runtime differ.

## 8. Caddy site fragment

Use an imported site fragment when supported by the existing configuration. Example to adapt:

```caddyfile
www.klyrow.com {
    redir https://klyrow.com{uri} permanent
}

klyrow.com {
    encode zstd gzip

    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()"
        X-Frame-Options "DENY"
        -Server
    }

    @immutable path /_nuxt/* /assets/*
    header @immutable Cache-Control "public, max-age=31536000, immutable"

    @formApi path /api/v1/*
    header @formApi Cache-Control "no-store"

    reverse_proxy 127.0.0.1:3100 {
        health_uri /api/v1/health
        health_interval 30s
        health_timeout 5s
        header_up X-Forwarded-Proto {scheme}
        header_up X-Request-ID {http.request.header.X-Request-ID}
    }

    log {
        output file /var/log/caddy/klyrow-website-access.log {
            roll_size 100MiB
            roll_keep 10
            roll_keep_for 720h
        }
        format json
    }
}
```

Important:

- adapt header/CSP behavior to the actual Nuxt response headers;
- avoid duplicate/conflicting headers;
- `includeSubDomains` in HSTS is allowed only after every relevant subdomain is HTTPS-ready;
- do not preload HSTS without separate deliberate review;
- do not log sensitive query strings or request bodies;
- if the site's CSP uses nonces, implement it in the application and preserve through Caddy;
- verify health-check support/version before relying on active health behavior;
- do not use `localhost` inside a separate Caddy container when the app is another container; use the actual service name/network address.

## 9. Environment contract

Example names only:

```text
NODE_ENV=production
HOST=127.0.0.1
PORT=3100
NUXT_PUBLIC_SITE_URL=https://klyrow.com
NUXT_PUBLIC_APP_URL=https://app.klyrow.com
NUXT_PUBLIC_API_DOCS_URL=
NUXT_PUBLIC_STATUS_URL=
NUXT_PUBLIC_ANALYTICS_ENABLED=false
NUXT_PUBLIC_GTM_ID=
NUXT_PUBLIC_GA_MEASUREMENT_ID=
NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NUXT_PUBLIC_PRICING_MODE=contact
KLYROW_WEBSITE_MIDDLEWARE_URL=
KLYROW_WEBSITE_MIDDLEWARE_AUTH_MODE=
KLYROW_WEBSITE_MIDDLEWARE_SECRET_FILE=
KLYROW_WEBSITE_MTLS_CA_FILE=
KLYROW_WEBSITE_MTLS_CERT_FILE=
KLYROW_WEBSITE_MTLS_KEY_FILE=
KLYROW_WEBSITE_FORM_RATE_LIMIT=
KLYROW_WEBSITE_CAPTCHA_PROVIDER=disabled
KLYROW_WEBSITE_CAPTCHA_SECRET_FILE=
```

Public runtime variables are visible to browsers. Only values intended to be public use the `NUXT_PUBLIC_` prefix.

## 10. Health and readiness

### Health

```text
GET /api/v1/health
```

Returns 200 if the Node process can serve requests. No secret or detailed infrastructure information.

### Readiness

```text
GET /api/v1/ready
```

Returns 200 only when critical internal configuration is valid. Middleware availability should be represented carefully: the site may remain readable while forms are degraded, but readiness/metrics must make the degradation visible.

Suggested response:

```json
{
  "status": "ready",
  "release": "<sha>",
  "forms": "available"
}
```

No database names, service tokens, file paths or private IP inventory in public responses.

## 11. Staging

Use a non-indexable staging hostname with authentication or IP restriction, for example:

```text
staging-web.klyrow.com
```

Staging requirements:

- `noindex, nofollow`;
- excluded from sitemap;
- test-mode middleware route;
- test-mode Odoo/n8n only;
- no production analytics;
- representative TLS and Caddy path;
- browser, form and Lighthouse validation;
- no customer-facing promotion until accepted.

## 12. Deployment procedure

1. Confirm release branch and exact SHA.
2. Confirm clean source checkout.
3. Run complete CI locally or verify immutable CI artifacts.
4. Build with locked dependencies.
5. Generate checksums and `RELEASE.json`.
6. Copy artifact into a new immutable release directory.
7. Validate environment file ownership/permissions.
8. Start candidate on an unused loopback port if possible.
9. Run local health, route and form test-mode smoke checks.
10. Back up active Caddy config and current release pointers.
11. Write/update only the Klyrow website site fragment.
12. Run `caddy fmt --diff` or equivalent review.
13. Run `caddy validate` against the complete active config.
14. Atomically switch the release pointer.
15. Restart/reload only the Klyrow website service.
16. Confirm loopback health/readiness.
17. Reload Caddy gracefully only after validation.
18. Confirm apex and www redirects externally.
19. Confirm TLS certificate and chain.
20. Run all production smoke tests.
21. Run a controlled test form with a unique marker through middleware test/approved production lead route.
22. Confirm Odoo/n8n result where authorized.
23. Monitor logs, latency and errors.
24. Record evidence and release SHA.

Do not use `docker compose down` or restart the complete middleware stack to deploy this website.

## 13. Production smoke tests

At minimum:

```text
GET /
GET /pricing
GET /solutions/developers
GET /features/email-api
GET /integrations/odoo
GET /es/
GET /sitemap.xml
GET /robots.txt
GET /api/v1/health
GET /api/v1/ready
HEAD /_nuxt/<asset>
POST controlled form test
www redirect
http -> https redirect
unknown route -> real 404
```

Validate:

- status code;
- canonical header/page metadata;
- compression;
- cache headers;
- CSP/security headers;
- no mixed content;
- no console errors;
- no CORS errors;
- no secret exposure;
- mobile rendering;
- form correlation ID.

## 14. Rollback

Rollback triggers:

- repeated 5xx;
- health/readiness failure;
- broken navigation or hydration;
- critical form failure;
- security-header regression;
- severe performance regression;
- TLS or redirect failure;
- unexpected impact to another Caddy site;
- sensitive-data exposure.

Rollback sequence:

1. stop accepting further release changes;
2. atomically restore `current` to `previous`;
3. restart only the Klyrow website service;
4. restore the prior Klyrow Caddy fragment if it changed;
5. validate the complete Caddy config;
6. reload Caddy gracefully;
7. run health and smoke checks;
8. confirm unrelated sites;
9. record incident and preserve failed release logs/artifact;
10. do not delete the failed release until investigation is complete.

The exact tested rollback command must be included in the release report.

## 15. Caddy/TLS evidence

Record:

```text
Caddy version
active config path
backup path/checksum
new fragment checksum
caddy validate result
reload result
certificate subject/SAN
issuer
notBefore/notAfter
TLS protocol test
HTTP/2 and HTTP/3 availability where supported
apex response
www redirect
HSTS/header result
```

Do not claim HTTP/3 if network/firewall configuration does not actually permit it.

## 16. Monitoring

Create or expose:

- process uptime/restart count;
- request count/status;
- latency;
- 5xx rate;
- form acceptance/failure;
- middleware latency/failure;
- memory/CPU;
- release SHA;
- TLS expiry alert;
- disk usage;
- Caddy service status;
- synthetic checks for home, pricing, health and a representative Spanish page.

No lead PII in metrics labels.

## 17. Production completion gate

Production is complete only when:

```text
RELEASE_SHA=recorded
CI=PASS
STAGING=PASS
DNS=PASS
CADDY_VALIDATE=PASS
TLS=PASS
HEALTH=PASS
ROUTES=PASS
MOBILE=PASS
ACCESSIBILITY=PASS
LIGHTHOUSE=PASS_OR_REVIEWED_EXCEPTION
FORMS=PASS
MIDDLEWARE_DURABILITY=PASS
ODOO_TEST/APPROVED_ROUTE=PASS
N8N_TEST/APPROVED_ROUTE=PASS
ROLLBACK=REHEARSED
UNRELATED_SERVICES=UNCHANGED
```

If an external dependency is unavailable, report `BLOCKED` with exact evidence rather than bypassing the gate.
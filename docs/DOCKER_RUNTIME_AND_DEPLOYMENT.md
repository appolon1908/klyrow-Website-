# Klyrow Website — Docker Runtime and Provider-Host Deployment

## Objective

Run the Nuxt 4/Nitro website as an immutable, non-root Docker workload on the same host as the Klyrow email platform:

```text
37.27.128.39
10.40.0.4
```

The existing public edge is Nginx with Certbot. Earlier Caddy/`65.109.65.169` instructions are superseded by `CODEX_PROVIDER_HOST_DEPLOYMENT_TASK.md` and `docs/PROVIDER_HOST_NGINX_DEPLOYMENT.md`.

## Topology

```text
Internet
  -> existing Nginx :80/:443
  -> klyrow.com / www.klyrow.com
  -> 127.0.0.1:${KLYROW_WEBSITE_PORT:-18110}
  -> website container
  -> Nuxt same-origin BFF
  -> authenticated Codestra middleware
```

Staging prefers `127.0.0.1:18111`. Both ports require a real free-port audit. Port 3100 must not be used by the website.

The website must preserve the existing Klyrow gateway, Postal, SMTP, Mautic, Grafana, billing, identity/private gateway, Kyqra and Nginx services.

## Required artifacts

```text
Dockerfile
.dockerignore
docker-compose.local.yml
docker-compose.staging.yml
docker-compose.production.yml
.env.example
ops/nginx/klyrow.com.website.conf.template
ops/runbooks/provider-host-deploy.md
scripts/docker-build.sh
scripts/docker-smoke.sh
scripts/deploy-staging.sh
scripts/deploy-production.sh
scripts/rollback-production.sh
scripts/verify-release.sh
scripts/audit-provider-host.sh
scripts/verify-protected-services.sh
```

## Dockerfile

Use `deps -> build -> runtime` stages.

Requirements:

- Node.js 22 active LTS or later supported active LTS;
- Corepack and pinned pnpm;
- frozen lockfile install;
- strict type/build validation;
- Nitro `.output` only in runtime;
- no private values at build time;
- non-root runtime user;
- graceful signal forwarding;
- OCI source/revision/version labels;
- no Git metadata, test reports, compiler cache or development tooling in runtime.

The container may listen internally on port 3000. The host publishes it only to loopback:

```yaml
ports:
  - "127.0.0.1:${KLYROW_WEBSITE_PORT:-18110}:3000"
```

## Container hardening

Production requires:

```yaml
read_only: true
tmpfs:
  - /tmp
security_opt:
  - no-new-privileges:true
cap_drop:
  - ALL
restart: unless-stopped
```

Also require:

- no privileged mode;
- no host network;
- no Docker socket;
- explicit environment allowlist;
- resource limits;
- log rotation;
- immutable image digest;
- dependency and image scanning;
- SBOM and provenance when supported;
- no secrets in image layers, labels, compose source or logs.

## Health and readiness

```text
GET /api/v1/health
GET /api/v1/ready
```

`health` proves the process is running. `ready` reports safe dependency state without exposing middleware URLs or credentials. Odoo/n8n outages must not make the process health endpoint fail.

## Environment

Commit placeholders only. Expected settings include:

```text
NODE_ENV
NITRO_HOST
NITRO_PORT
KLYROW_WEBSITE_PORT
PUBLIC_SITE_URL
PUBLIC_SIGN_IN_URL
PUBLIC_DOCS_URL
PUBLIC_STATUS_URL
PUBLIC_SUPPORT_EMAIL
PUBLIC_PRICING_MODE
PUBLIC_SUPPORTED_LOCALES
MIDDLEWARE_BASE_URL
MIDDLEWARE_API_KEY_FILE
MIDDLEWARE_CLIENT_CERT_FILE
MIDDLEWARE_CLIENT_KEY_FILE
MIDDLEWARE_CA_FILE
FORM_RATE_LIMIT_BACKEND
REDIS_URL_FILE
CAPTCHA_PROVIDER
CAPTCHA_SITE_KEY
CAPTCHA_SECRET_FILE
GTM_CONTAINER_ID
GA4_MEASUREMENT_ID
SEARCH_CONSOLE_VERIFICATION
SCHEDULING_PUBLIC_URL
RELEASE_SHA
```

Private values come from root-owned files, Docker secrets or an approved secret manager.

## Local, staging and production

### Local

- loopback-only binding;
- mocked middleware by default;
- no production credentials;
- deterministic browser tests.

### Staging

- production image;
- loopback-only port 18111 or approved free alternative;
- isolated staging secrets;
- test middleware routes;
- no real Odoo accounting;
- restricted/disabled n8n effects;
- no live email or production billing;
- separate name, logs and evidence.

### Production

- immutable digest;
- loopback-only port 18110 or approved free alternative;
- no source mounts;
- no `latest`;
- no build in live release directory;
- healthcheck, restart, limits and log rotation;
- production secret files;
- prior release retained.

## Release directories

```text
/srv/klyrow-website/
  releases/<release-sha>/
  config/
  secrets/
  current -> releases/<release-sha>/
  previous -> releases/<previous-sha>/
  evidence/
```

Development stays in:

```text
/srv/codex-workspaces/klyrow-Website-
```

## Image publication

The release workflow must:

1. check out the exact reviewed SHA;
2. install from the frozen lockfile;
3. run type, lint, test and build checks;
4. build the image;
5. scan it;
6. generate SBOM/provenance;
7. push an immutable SHA tag;
8. record the digest and checksums.

Production deploys the digest.

## Provider-host preflight

The deployment scripts must verify:

- host IP is `37.27.128.39` or `10.40.0.4`;
- chosen website port is unoccupied;
- existing Nginx configuration and certificates are captured;
- existing containers/listeners are inventoried;
- Klyrow gateway, Postal, SMTP, Mautic, Grafana and Kyqra are healthy;
- CPU, memory, disk and inode headroom are sufficient;
- required secret files exist without printing values.

If capacity or port ownership is uncertain, stop.

## Staging deployment

`ops/docker-runtime` may deploy a candidate to the isolated staging loopback port. It must run:

- health/readiness;
- route and asset smoke;
- form-mock tests;
- graceful shutdown/restart;
- resource-limit behavior;
- secret/image scans;
- rollback rehearsal;
- protected-service health before and after.

This branch may not switch public Nginx traffic.

## Production deployment

Only `release/website-production-v1` may:

1. verify exact release SHA and digest;
2. capture existing Nginx/container/service evidence;
3. back up complete Nginx configuration with checksums;
4. start the candidate on loopback;
5. pass local and staging-equivalent checks;
6. validate the complete host-specific Nginx configuration;
7. prove `app`, `api`, `track`, `bounce` and protected services remain healthy;
8. install only the reviewed website host split;
9. gracefully reload Nginx;
10. run external HTTPS, redirect, route, asset, API-health and durable-form tests;
11. soak while monitoring both the website and email platform;
12. mark current only after success;
13. retain the previous release and Nginx backup.

Never restart the Docker daemon or the complete provider stack for a website release.

## Rollback

Rollback restores the checksum-verified prior Nginx configuration and prior website release, validates Nginx, gracefully reloads it, then verifies apex and every protected Klyrow hostname/service.

Rollback triggers include:

- health/readiness failure;
- broken home, pricing, localized or form routes;
- elevated 5xx/latency;
- middleware durable-acceptance failure;
- Nginx/TLS failure;
- regression on app/api/track/bounce;
- Klyrow, Postal, SMTP, Mautic, Grafana or Kyqra degradation;
- resource saturation.

## Acceptance

```text
Docker build=PASS
non-root=PASS
read-only=PASS_OR_REVIEWED_EXCEPTION
health/readiness=PASS
graceful shutdown=PASS
restart recovery=PASS
resource limits=PASS
secret scan=PASS
image scan=PASS
SBOM=PRESENT
staging on provider host=PASS
staging rollback=PASS
Nginx backup=PASS
Nginx validate=PASS
apex HTTPS=PASS
www redirect=PASS
app/api unchanged=PASS
track/bounce unchanged=PASS
protected services healthy=PASS
form durable acceptance=PASS
```

`ops/caddy-edge` is superseded for this host. The active edge branch is `ops/provider-host-nginx-edge`.
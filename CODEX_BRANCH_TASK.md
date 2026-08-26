# Codex Branch Task — Hardened Docker Runtime

## Branch

```text
ops/docker-runtime
```

## Prerequisites

Update from the accepted application, integration, SEO, analytics and performance/accessibility branches before implementation.

## Objective

Package Klyrow Website as an immutable, non-root Docker workload with safe local, staging and production compose definitions. This branch may deploy to staging only. It must not switch public production traffic.

## Required reading

Read `docs/DOCKER_RUNTIME_AND_DEPLOYMENT.md` completely.

## Required implementation

- Multi-stage `Dockerfile` with dependency, build and runtime stages.
- `.dockerignore` excluding secrets, Git data, caches, reports and local files.
- Corepack/pnpm frozen install.
- Nitro `.output` only in runtime image.
- Dedicated non-root user.
- `NODE_ENV=production`.
- Graceful SIGTERM and signal forwarding.
- Healthcheck using `/api/v1/health`.
- Startup environment validation.
- Read-only root filesystem where practical.
- tmpfs for `/tmp`.
- `no-new-privileges` and dropped capabilities.
- No Docker socket, host network or privileged mode.
- No secret in image layers, labels or compose source.
- `docker-compose.local.yml`.
- `docker-compose.staging.yml`.
- `docker-compose.production.yml` or approved production fragment using immutable image digest.
- Resource limits and log rotation guidance.
- Build and smoke scripts.
- Staging deploy and rollback scripts.
- Image labels for source/revision/version.
- Image scan.
- SBOM.
- Immutable GHCR publication workflow only through explicit dispatch/release conditions.

## Runtime topology

```text
Caddy
  -> loopback/private Docker upstream :3100
  -> Nuxt/Nitro
```

Do not expose port 3100 publicly.

## Required tests

- Reproducible Docker build from clean checkout.
- Runtime contains required output and excludes source/tooling/secrets.
- Container runs as non-root.
- Read-only filesystem behavior.
- Healthcheck and readiness.
- SIGTERM graceful shutdown.
- Restart recovery.
- Local compose smoke.
- Staging compose smoke.
- Route, static asset and form-mock checks.
- Resource-limit behavior.
- Secret scan, dependency audit, image scan and SBOM.
- No live Odoo/n8n/billing/email side effects.
- Rollback rehearsal in staging.

## Deployment scripts

Scripts must:

- verify host identity and prerequisites;
- never print secrets;
- use isolated release directories;
- reference exact SHA/image digest;
- preserve previous release;
- be idempotent;
- stop on failed health/readiness;
- avoid restarting the Docker daemon or unrelated services.

## Git delivery

Push only this branch, open/update one draft PR and attach image digest/scan/SBOM/staging evidence. Stop before Caddy edge or public production.

## Prohibited

- No public production switch.
- No mutable `latest` deployment.
- No source mounts in production.
- No build inside live web root.
- No unrelated stack restart.
- No Postal/Odoo/n8n/Keycloak change.

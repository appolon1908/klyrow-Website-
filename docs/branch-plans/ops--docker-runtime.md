# Codex Branch Task — Hardened Docker Runtime on Provider Host

## Branch

```text
ops/docker-runtime
```

## Prerequisites

Update from all accepted application, integration, SEO, legal, analytics and performance/accessibility branches.

## Target

```text
Host: 37.27.128.39
Private IP: 10.40.0.4
Production loopback port: 18110 after free-port verification
Staging loopback port: 18111 after free-port verification
Public edge: existing Nginx, not Caddy
```

Read `CODEX_PROVIDER_HOST_DEPLOYMENT_TASK.md`, `docs/PROVIDER_HOST_NGINX_DEPLOYMENT.md` and `docs/DOCKER_RUNTIME_AND_DEPLOYMENT.md` completely.

## Objective

Package Klyrow Website as an immutable, non-root Docker workload and prove it can run safely on the same host as the Klyrow email platform. This branch may deploy to the isolated staging loopback port only. It must not switch public Nginx traffic.

## Protected services

Audit and preserve the existing Nginx edge, Klyrow gateway/API, Postal, SMTP, Mautic, Grafana, billing, identity/private gateway, Kyqra and their dependencies. Do not reuse their ports or restart/remap them.

## Required implementation

- multi-stage Dockerfile;
- `.dockerignore`;
- frozen pnpm install and Nitro-only runtime;
- dedicated non-root user;
- graceful SIGTERM;
- read-only root filesystem where practical;
- tmpfs `/tmp`;
- `no-new-privileges` and all capabilities dropped;
- no Docker socket, host network or privileged mode;
- explicit environment allowlist;
- health/readiness;
- resource limits and log rotation;
- local, provider-host staging and production compose fragments;
- loopback-only published ports;
- host/preflight and free-port checks;
- protected-service health verification before/after tests;
- isolated release directories;
- exact SHA/digest build, smoke, stage, verify and rollback scripts;
- image labels, scan, SBOM and immutable GHCR publication;
- no secret in image layers, labels, compose source or logs.

## Required compose behavior

Staging must bind only to:

```text
127.0.0.1:18111
```

or an approved free alternative recorded in evidence.

Production compose must default to:

```text
127.0.0.1:18110
```

or an approved free alternative, but this branch must not activate public traffic.

Port 3100 is prohibited for this website.

## Required tests

- reproducible clean build;
- runtime excludes source/tooling/secrets;
- non-root/read-only behavior;
- health/readiness;
- graceful shutdown and restart recovery;
- free-port guard;
- staging start on provider host;
- route, asset and form-mock smoke;
- CPU/RAM/disk/log behavior;
- Klyrow gateway, Postal, SMTP, Mautic, Grafana and Kyqra unchanged;
- no live Odoo/n8n/billing/email side effects;
- dependency, secret and image scans;
- SBOM and digest evidence;
- staging rollback rehearsal.

## Deployment-script rules

Scripts must verify host identity, exact artifact, free port, required secret files and protected-service health without printing secrets. They must be idempotent, preserve the prior website release and avoid restarting Nginx, Docker daemon or unrelated services.

## Git delivery

Push only this branch, update its draft PR with exact image/digest/scan/SBOM/staging/protected-service evidence, and stop before `ops/provider-host-nginx-edge`.

## Prohibited

- no public production switch;
- no Caddy installation;
- no port 3100;
- no mutable `latest` deployment;
- no source mount in production;
- no build in live release path;
- no Nginx activation;
- no provider-stack restart;
- no Postal/Odoo/n8n/Keycloak or billing change.
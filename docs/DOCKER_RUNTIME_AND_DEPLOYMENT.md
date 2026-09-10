# Klyrow Website — Docker Runtime and Deployment Contract

## Status and supersession

This document supersedes the earlier Caddy/`65.109.65.169`/port-`3100` website topology.

The current provider-host direction is:

```text
Host: 37.27.128.39
Private network context: 10.40.0.4
Existing public edge: Nginx + Certbot
Preferred website production loopback: 127.0.0.1:18110 after host audit
Preferred website staging loopback: 127.0.0.1:18111 after host audit
```

Do not install Caddy, bind the website directly to public interfaces, take over port 3100, or replace the provider host's full Nginx configuration. The dedicated source contract is `docs/PROVIDER_HOST_NGINX_DEPLOYMENT.md`.

## 1. Objective

Run the Nuxt 4/Nitro public website as an immutable, non-root workload behind the existing Nginx edge while preserving every unrelated Klyrow and provider service.

A repository merge is not a deployment. This contract requires an exact protected-main source SHA, immutable image digest, protected environment approval, staging evidence, and rollback evidence before any public cutover.

## 2. Runtime topology

```text
Internet
  -> existing Nginx on 37.27.128.39 :80/:443
     -> klyrow.com / www.klyrow.com
        -> Klyrow Website immutable container on reviewed loopback port
     -> app.klyrow.com / api.klyrow.com / track / bounce
        -> existing protected services, unchanged

Klyrow Website server adapters
  -> reviewed private Kong/Middleware endpoints
  -> governed Klyrow/Odoo/n8n services
```

The website container must not expose a host-public port. Browser code must not call private middleware, Odoo, n8n, Postal, Mautic, or provider administration directly.

## 3. Required artifacts

Current implementation work must converge on reviewed equivalents of:

```text
Dockerfile
.dockerignore
compose.local.yaml
compose.staging.yaml
compose.production.yaml
ops/nginx/klyrow.com.conf
scripts/build-image.sh
scripts/verify-image.sh
scripts/deploy-staging.sh
scripts/smoke-staging.sh
scripts/prepare-nginx-candidate.sh
scripts/apply-nginx-candidate.sh
scripts/rollback-nginx.sh
scripts/rollback-release.sh
release/release-intent.json
release/runtime-paths.json
```

Paths may differ only when the authoritative runbook and CI validators are updated together.

## 4. Dockerfile contract

Use a multi-stage build:

```text
deps -> build -> runtime
```

### Dependencies

- supported Node.js 22 LTS image pinned by digest;
- Corepack enabled;
- pnpm version pinned by `packageManager`;
- `pnpm install --frozen-lockfile`;
- no production secret mounted or copied.

### Build

- copy only required workspace source and public assets;
- run type checking, lint, tests, public-bundle secret exclusion, dependency analysis, and production build;
- bind reproducible metadata to the exact source SHA and `SOURCE_DATE_EPOCH`;
- emit Nitro `.output` without private runtime values.

### Runtime

- copy only production output and required release metadata;
- use a dedicated non-root UID/GID;
- use `tini` or equivalent signal forwarding;
- set `NODE_ENV=production`;
- use the reviewed loopback host mapping, not a public container port;
- include OCI source, revision, version, license, and creation labels;
- include health and readiness probes;
- support graceful SIGTERM;
- exclude Git metadata, compiler toolchains, package caches, test artifacts, and secrets.

## 5. Container restrictions

Required runtime controls:

- non-root user;
- read-only root filesystem where supported;
- tmpfs for writable temporary paths;
- `no-new-privileges`;
- all Linux capabilities dropped unless a reviewed exception exists;
- no privileged mode;
- no Docker socket;
- no host networking;
- no broad host mounts;
- bounded CPU, memory, PID, and log retention;
- secret files mounted read-only and never echoed;
- explicit public/runtime environment allowlists;
- health failure must stop promotion.

## 6. Immutable release evidence

For one exact protected-main SHA, produce and retain:

- immutable OCI digest;
- source-label readback;
- dependency audit;
- HIGH/CRITICAL vulnerability scan;
- CycloneDX SBOM;
- provenance/attestation;
- signature where the release policy requires it;
- deterministic or reproducible-build comparison;
- public-bundle secret-exclusion result;
- configuration checksum;
- previous exact digest and rollback tuple.

Do not deploy a mutable tag such as `latest`, rebuild between staging and production, or retag an unverified image as the approved candidate.

## 7. Staging-readonly gate

Deploy the exact candidate digest to the reviewed staging loopback port without modifying public DNS or the production Nginx server block.

Required validation includes:

- container non-root/read-only restrictions;
- health, readiness, and exact source-version readback;
- all public routes and localized routes;
- account handoff to `app.klyrow.com`;
- no browser token storage;
- security and cache headers;
- accessibility and responsive checks;
- Middleware adapter fail-closed behavior;
- zero live email, billing, provider, Odoo, n8n, and identity effects;
- monitoring and alert visibility;
- backup and rollback rehearsal.

## 8. Nginx change boundary

Before public cutover:

1. audit listeners, existing server blocks, certificate paths, and protected hostnames;
2. archive the complete current Nginx configuration and record a checksum;
3. generate an isolated candidate that changes only `klyrow.com` and `www.klyrow.com`;
4. prove `app.klyrow.com`, `api.klyrow.com`, track, bounce, Postal, SMTP, Mautic, Grafana, billing, identity/private gateway, Kyqra, and unrelated sites remain unchanged;
5. run `nginx -t` against the candidate;
6. require explicit protected production approval;
7. perform an Nginx-only reload;
8. validate HTTPS, redirect, headers, assets, application handoff, and protected services;
9. restore the exact backup immediately on any stop condition.

Never perform a full provider-stack restart for a website edge change.

## 9. Rollback

Rollback must restore both:

- the previous immutable website image digest; and
- the checksummed previous Nginx configuration.

Record RTO, data/configuration integrity, health/readiness/version readback, and protected-service checks. Because the public website should hold no authoritative customer data, rollback must not depend on an application database mutation.

## 10. Production stop conditions

Stop and roll back on any:

- source or image-digest mismatch;
- health/readiness failure;
- Nginx validation or reload error;
- certificate or hostname mismatch;
- application/API/track/bounce regression;
- security-header or cache-policy regression;
- browser token-storage finding;
- monitoring loss;
- unexpected write or external effect;
- accessibility, route, or asset failure beyond the approved threshold.

## 11. Safety

This contract authorizes no current deployment, DNS change, Nginx reload, provider activation, live email delivery, billing action, Odoo mutation, n8n activation, Keycloak change, or production traffic shift.

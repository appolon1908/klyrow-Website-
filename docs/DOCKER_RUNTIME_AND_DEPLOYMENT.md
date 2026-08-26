# Klyrow Website — Docker Runtime and Deployment Contract

## 1. Objective

Run the Nuxt 4/Nitro public website as an immutable, non-root Docker workload behind the existing Codestra Caddy edge. This contract covers website runtime only and must not restart or modify unrelated middleware, Odoo, n8n, Postal, Keycloak or database services.

## 2. Runtime topology

Preferred production topology:

```text
Internet
  -> Caddy on 65.109.65.169 :80/:443
  -> klyrow-website container on loopback or isolated Docker network :3100
  -> Nuxt same-origin BFF APIs
  -> authenticated Codestra middleware endpoint
```

The application port must not be publicly exposed.

## 3. Required repository artifacts

```text
Dockerfile
.dockerignore
docker-compose.local.yml
docker-compose.staging.yml
docker-compose.production.yml
ops/caddy/klyrow.com.Caddyfile
ops/systemd/klyrow-website.service or approved compose service wrapper
scripts/docker-build.sh
scripts/docker-smoke.sh
scripts/deploy-staging.sh
scripts/deploy-production.sh
scripts/rollback-production.sh
scripts/verify-release.sh
```

The implementation may use equivalent paths when clearly documented, but must keep runtime, edge and release concerns separated.

## 4. Dockerfile contract

Use a multi-stage build:

```text
deps -> build -> runtime
```

### Dependencies stage

- Node.js 22 active LTS or later supported active LTS.
- Corepack enabled.
- pnpm version pinned through `packageManager`.
- `pnpm install --frozen-lockfile`.
- Dependency cache may be used only in build stages.

### Build stage

- Copy only required source/config.
- Run type check, build-time validation and `pnpm build`.
- Produce Nitro `.output`.
- Do not inject private runtime secrets at build time.
- Public build-time values must be explicitly classified.

### Runtime stage

- Copy only Nitro production output and required runtime metadata.
- Run as a dedicated non-root user.
- Set `NODE_ENV=production`.
- Default `NITRO_HOST=0.0.0.0` inside the container and bind externally only through loopback/network policy.
- Default `NITRO_PORT=3100`.
- No Git metadata, source maps containing secrets, package manager cache, compiler toolchain or test files.
- Use `tini` or equivalent init behavior when needed for signal forwarding.
- Support graceful SIGTERM.
- Include OCI labels for source repository, revision, build time and version.

## 5. `.dockerignore`

At minimum exclude:

```text
.git
.github
node_modules
.nuxt
.output
coverage
playwright-report
test-results
.env
.env.*
!.env.example
*.log
.DS_Store
local secrets
editor files
```

Do not accidentally exclude required content data or public assets.

## 6. Container security

Required:

- non-root user;
- `no-new-privileges`;
- drop all Linux capabilities unless an evidence-backed exception exists;
- read-only root filesystem where practical;
- tmpfs for `/tmp`;
- no Docker socket;
- no host network;
- no privileged mode;
- no production secret in image history;
- explicit environment allowlist;
- request/body limits at Caddy and application layers;
- resource limits documented and tested;
- container image scan;
- dependency audit;
- SBOM generation;
- immutable image digest in production.

Suggested compose hardening:

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

## 7. Health and readiness

The container healthcheck uses:

```text
GET http://127.0.0.1:3100/api/v1/health
```

Readiness uses:

```text
GET /api/v1/ready
```

`health` must not depend on Odoo/n8n. `ready` may expose a safe degraded status for middleware configuration or connectivity but must not leak URLs or credentials.

Example safe response:

```json
{
  "status": "ready",
  "version": "git-sha",
  "dependencies": {
    "middleware": "configured"
  }
}
```

## 8. Environment configuration

Commit only `.env.example` with placeholders.

Expected variables include:

```text
NODE_ENV
NITRO_HOST
NITRO_PORT
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
FORM_WEBHOOK_PATH or approved middleware route
FORM_RATE_LIMIT_BACKEND
REDIS_URL_FILE when used
CAPTCHA_PROVIDER
CAPTCHA_SITE_KEY
CAPTCHA_SECRET_FILE
GTM_CONTAINER_ID
GA4_MEASUREMENT_ID
SEARCH_CONSOLE_VERIFICATION
SCHEDULING_PUBLIC_URL
RELEASE_SHA
```

Private values must be supplied through root-owned files, Docker secrets or an approved secret manager. Do not put private values in compose files, image labels, logs or public runtime config.

## 9. Local compose

`docker-compose.local.yml` may expose the app on `127.0.0.1:3100` and use mocked middleware.

It must support:

- deterministic startup;
- healthcheck;
- hot reload only in local development when explicitly selected;
- no production credentials;
- repeatable browser tests.

## 10. Staging compose

Staging must:

- use a production build;
- use isolated staging secrets;
- use staging/test middleware routes;
- prohibit real Odoo accounting and unrestricted n8n workflows;
- bind to an isolated port/network;
- support staging Caddy or an authenticated direct check;
- preserve logs and metrics for acceptance evidence.

## 11. Production compose

Production must:

- reference an immutable image digest;
- bind only to loopback or a private Docker network;
- have healthcheck and restart policy;
- use read-only filesystem and tmpfs;
- specify resource limits or documented host-level controls;
- use production secret files;
- define log rotation;
- never include source mounts;
- never use `latest`;
- never build on the live host unless explicitly approved and evidence-backed.

## 12. Image build and publication

CI release workflow:

1. checkout exact reviewed release SHA;
2. frozen dependency install;
3. type check, lint, tests and build;
4. build image;
5. scan image;
6. generate SBOM;
7. generate provenance/attestation when supported;
8. push immutable tag and digest;
9. record checksums and image digest in release evidence.

Recommended tags:

```text
ghcr.io/appolon1908-hue/klyrow-website:<git-sha>
ghcr.io/appolon1908-hue/klyrow-website:v1.x.y
```

Production deploys the digest, not a mutable tag.

## 13. Release directories

Use an isolated release structure such as:

```text
/srv/klyrow-website/
  releases/<release-sha>/
  config/
  secrets/
  current -> releases/<release-sha>/
  previous -> releases/<previous-sha>/
  evidence/
```

Source development occurs in `/srv/codex-workspaces/klyrow-Website-`, not in the live release directory.

## 14. Deployment algorithm

`deploy-production.sh` must:

1. verify host identity;
2. verify exact release SHA and image digest;
3. verify clean/no-uncommitted source workspace when source is used for metadata only;
4. confirm required secret files exist without printing them;
5. confirm DNS for apex and `www` points to the intended host;
6. confirm ports 80/443 are reachable or appropriately bound;
7. back up complete Caddy configuration;
8. capture current container/image/release state;
9. pull immutable image;
10. create release metadata;
11. start candidate on an isolated temporary port/network;
12. run health, readiness, route, form-mock and static-asset smoke tests;
13. validate Caddy configuration;
14. switch Caddy upstream or compose service atomically;
15. reload Caddy only;
16. run external HTTPS and redirect checks;
17. monitor for defined soak period;
18. mark release current only after checks pass;
19. preserve previous release for rollback.

Never restart the entire Docker daemon or middleware stack for this website deployment.

## 15. Rollback algorithm

Rollback triggers include:

- health/readiness failure;
- elevated 5xx rate;
- broken home/pricing/form route;
- TLS/Caddy failure;
- middleware form acceptance failure;
- severe accessibility or rendering regression discovered during activation;
- resource saturation caused by the candidate.

`rollback-production.sh` must:

1. identify last known-good digest/release;
2. restore prior compose/service configuration;
3. validate Caddy;
4. switch upstream back;
5. reload Caddy only;
6. verify external HTTPS routes and form-safe behavior;
7. retain failed candidate logs/evidence;
8. avoid deleting the failed release until investigation completes.

Rollback must be rehearsed in staging.

## 16. Caddy contract

The Caddy site fragment must provide:

```caddyfile
klyrow.com {
  encode zstd gzip
  reverse_proxy <private-or-loopback-upstream> {
    header_up X-Request-ID {http.request.uuid}
  }
}

www.klyrow.com {
  redir https://klyrow.com{uri} permanent
}
```

The actual implementation must add:

- security headers compatible with Nuxt;
- hashed asset cache policy;
- no-cache/private policy for API and sensitive responses;
- request body limits;
- access log filtering/rotation;
- trusted proxy policy where applicable;
- no disclosure of internal upstream addresses in error pages.

Do not blindly copy the example without auditing existing global Caddy options and imported fragments.

## 17. Observability

Expose privacy-safe metrics/logs for:

- request count and latency;
- status code classes;
- form accepts/rejects/duplicates;
- middleware latency/failure;
- rate limiting;
- CAPTCHA outcomes without tokens;
- health/readiness;
- process memory and event-loop lag where practical;
- deployment version.

Do not log form message bodies, full phone numbers, CAPTCHA tokens, credentials or authorization headers.

## 18. Acceptance tests

Required before production:

```text
Docker build = PASS
container starts as non-root = PASS
read-only filesystem = PASS or documented reviewed exception
healthcheck = PASS
SIGTERM graceful shutdown = PASS
restart recovery = PASS
resource limit behavior = PASS
secret scan = PASS
image scan = PASS
SBOM = PRESENT
staging deploy = PASS
staging rollback rehearsal = PASS
Caddy backup = PASS
Caddy validate = PASS
apex HTTPS = PASS
www redirect = PASS
hashed asset caching = PASS
HTML/API cache policy = PASS
form durable acceptance = PASS
unrelated services unchanged = PASS
```

## 19. Production restriction

Only `release/website-production-v1` may deploy the public site. `ops/docker-runtime` and `ops/caddy-edge` may build and stage artifacts but must not switch public production traffic.

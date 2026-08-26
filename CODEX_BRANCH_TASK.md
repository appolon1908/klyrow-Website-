# Codex Branch Task — Provider Host Nginx Edge

## Branch

```text
ops/provider-host-nginx-edge
```

## Prerequisite

Update from the accepted `ops/docker-runtime` head and all exact reviewed application prerequisites before implementation.

## Target

```text
Host: 37.27.128.39
Private IP: 10.40.0.4
Edge: existing Nginx + Certbot
Website production upstream: 127.0.0.1:18110 after free-port verification
Website staging upstream: 127.0.0.1:18111 after free-port verification
```

Do not install or activate Caddy. Do not use port 3100.

## Required reading

Read completely:

- `CODEX_PROVIDER_HOST_DEPLOYMENT_TASK.md`;
- `docs/PROVIDER_HOST_NGINX_DEPLOYMENT.md`;
- `docs/DOCKER_RUNTIME_AND_DEPLOYMENT.md`;
- `docs/BRANCH_AND_DELIVERY_PLAN.md`;
- website API/form/security/release contracts;
- current Nginx configuration represented in `appolon1908-hue/klyrow.com`.

## Objective

Prepare and rehearse a host-specific Nginx split that places the public marketing website on the same host as the Klyrow email platform while preserving every current application, API, delivery and operational service.

This branch may audit, generate, validate and stage the edge change. It must not activate public production traffic.

## Mandatory preflight

Record without exposing secrets:

```text
HOSTNAME
HOST_IPS
LISTENING_PORTS
RUNNING_SYSTEM_SERVICES
DOCKER_CONTAINERS
DOCKER_NETWORKS
DISK_AND_INODES
MEMORY
NGINX_VERSION
NGINX_SERVICE_STATE
FULL_NGINX_CONFIG_PATHS
CERTIFICATE_NAMES_AND_EXPIRY
CURRENT_PUBLIC_HOST_RESULTS
```

Verify known protected service ports and identify their actual owners. Stop if the preferred website ports are occupied.

## Protected services

Preserve at minimum:

- Nginx public edge;
- Klyrow gateway/application/API;
- Postal web/workers/SMTP;
- Mautic;
- Grafana/operations;
- Klyrow billing;
- Keycloak/internal identity;
- private gateway;
- Kyqra crawler;
- RabbitMQ, databases and messaging dependencies;
- all current delivery/tracking/bounce routes.

No full Docker, Nginx, Postal, Klyrow, Mautic, SMTP, Keycloak or provider-stack restart is allowed.

## Required hostname result

```text
klyrow.com
www.klyrow.com       -> website candidate/upstream

app.klyrow.com       -> preserve existing Klyrow application behavior
api.klyrow.com       -> preserve existing Klyrow API behavior
track.klyrow.com     -> preserve current delivery behavior
bounce.klyrow.com    -> preserve current delivery behavior
```

Do not expose administrative paths on the marketing apex.

## Required implementation

- provider-host audit script;
- protected-service verification script;
- complete Nginx backup script with timestamp and checksums;
- host-specific Nginx website fragment/template;
- exact before/after host-routing manifest;
- `www` to apex permanent redirect;
- website reverse proxy to loopback only;
- request ID and proxy headers;
- bounded proxy timeouts;
- request-body limits;
- compression supported by installed Nginx;
- immutable cache for hashed Nuxt assets;
- no-cache/private policy for HTML and sensitive APIs;
- tested security headers;
- privacy-safe logs and rotation;
- candidate configuration assembly without editing live config;
- full Nginx validation script;
- Nginx-only graceful reload script guarded for the release branch;
- checksum-verified rollback script;
- local/staging host-header and TLS smoke tests;
- protected-service before/after tests;
- runbook and exact evidence template.

## Cross-repository requirement

The current Nginx topology is represented in `appolon1908-hue/klyrow.com`. Create or reference a dedicated reviewed Klyrow software PR for the production host split. Do not leave the live edge change untracked in either repository.

## Required tests

- preferred production/staging ports are free;
- website staging container is healthy on loopback;
- complete candidate Nginx configuration validates;
- no unrelated Nginx host changes;
- apex and `www` behavior passes in staging/host-header simulation;
- `app` and `api` remain unchanged;
- `track` and `bounce` remain unchanged;
- Klyrow gateway, Postal, SMTP, Mautic, Grafana and Kyqra remain healthy;
- body limits, cache and security headers pass;
- upstream failure returns safe errors;
- Nginx reload command is not executed from this branch against public production;
- rollback rehearsal restores the prior candidate configuration;
- secret and private-key scans pass.

## Git delivery

Push only this branch, open/update one draft PR and attach exact audit, config diff, validation, protected-service and rollback evidence.

Stop before `release/website-production-v1`.

## Prohibited

- no Caddy installation;
- no public production activation;
- no public DNS mutation;
- no full provider-stack restart;
- no unrelated Nginx site edit;
- no TLS private-key commit;
- no port takeover;
- no direct Postal/Odoo/n8n/Keycloak/database mutation;
- no live email or billing change;
- no untracked live configuration edit.
# Historical planning record — not deployment authority

Preserved during conflict reconciliation. The current contract is [PROVIDER_HOST_NGINX_DEPLOYMENT.md](../PROVIDER_HOST_NGINX_DEPLOYMENT.md). The plan below is historical and does not authorize operations.

# Klyrow Website — Provider Host Deployment

## Binding decision

The public website will run on the same host as the Klyrow email platform:

```text
Public host: 37.27.128.39
Private host: 10.40.0.4
Edge: existing Nginx and Certbot
```

This document overrides earlier website instructions that targeted `65.109.65.169` or required Caddy.

Do not install Caddy on this host. Nginx already owns public ports 80 and 443.

## Protected existing services

Codex must audit the host before changes and preserve all existing services. Known assigned listeners include:

```text
Klyrow gateway      18000
Mautic              18001
Postal web          18002
Grafana/operations  18003
Klyrow billing      18080
Keycloak/internal   18082
private gateway     18443
Kyqra crawler       3100
SMTP and messaging  existing assigned ports
```

The website must not reuse or remap these ports.

## Website runtime

Preferred loopback bindings, only after proving they are unused:

```text
production  127.0.0.1:18110
staging     127.0.0.1:18111
```

If either port is occupied, Codex must stop and record an approved alternative. The website container must never publish its application port publicly.

## Required host routing

Nginx must be split by hostname:

```text
klyrow.com
www.klyrow.com       -> Klyrow Website

app.klyrow.com
api.klyrow.com       -> preserve existing Klyrow gateway behavior

track.klyrow.com
bounce.klyrow.com    -> preserve existing delivery behavior
```

Any existing Mautic, Postal, Grafana, webhook or operational routes must be preserved and scoped to the correct hostname. Administrative routes must not become public website routes.

## Repository ownership

`appolon1908-hue/klyrow-Website-` owns the website source, BFF, Docker runtime, website release scripts and an Nginx fragment template.

`appolon1908-hue/klyrow.com` owns the existing Klyrow service topology and current Nginx configuration. A production edge edit must have reviewed source and rollback evidence; no untracked live edit is allowed.

## Deployment requirements

Before any switch, Codex must record:

- host identity and occupied listeners;
- running system and Docker services;
- Nginx full configuration and validation result;
- certificate inventory without private keys;
- current behavior of apex, `www`, `app`, `api`, `track` and `bounce`;
- local health of the Klyrow gateway, Postal, Mautic, Grafana and Kyqra;
- CPU, memory, disk and inode headroom.

The website container must be immutable, non-root, read-only where practical, capability-free, loopback-bound, healthchecked, resource-limited and deployed by digest.

## Nginx rules

The website Nginx block must provide:

- apex HTTPS;
- permanent `www` to apex redirect;
- reverse proxy to the loopback website port;
- request ID propagation;
- bounded timeouts and request-body limits;
- compression supported by the installed Nginx;
- immutable cache for hashed Nuxt assets;
- no-cache/private handling for HTML and sensitive APIs;
- tested security headers;
- privacy-safe rotated logs;
- no internal-upstream disclosure.

Codex must validate the complete Nginx configuration before a graceful Nginx-only reload. It must not restart Docker, Postal, Klyrow, Mautic, SMTP, Keycloak or the provider stack.

## Deployment sequence

1. Verify host and free website port.
2. Capture existing service, Nginx, certificate and resource evidence.
3. Back up the complete Nginx configuration with checksums.
4. Verify exact website release SHA and immutable image digest.
5. Start the candidate on an isolated loopback port.
6. Run health, readiness, route, asset and form-safe smoke tests.
7. Validate the complete candidate Nginx configuration.
8. Recheck all protected existing services and hostnames.
9. Install only the reviewed website host split.
10. Gracefully reload Nginx.
11. Run external apex, `www`, TLS, API-health and form tests.
12. Monitor website and existing Klyrow services during soak.
13. Mark current only after all checks pass.
14. Preserve the prior website release and prior Nginx configuration.

## Rollback

Rollback restores the checksum-verified previous Nginx configuration and prior website release, validates Nginx, gracefully reloads it, and verifies every protected Klyrow hostname and service. The whole Docker daemon or provider stack must never be restarted for a website rollback.

## Stop conditions

Stop or roll back on:

- occupied website port;
- failed Nginx validation;
- broken TLS or apex/`www` behavior;
- regression on `app`, `api`, `track` or `bounce`;
- unhealthy Klyrow gateway, Postal, SMTP, Mautic, Grafana or Kyqra;
- website health/readiness or durable form failure;
- resource saturation;
- missing artifact, secret-file, DNS, certificate, review or rollback evidence.

Only `release/website-production-v1` may switch public apex traffic. `ops/provider-host-nginx-edge` may prepare and rehearse the host split but may not activate production. `ops/caddy-edge` is superseded for this host.
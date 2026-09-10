# Codex Deployment Override — Klyrow Provider Host

This file is authoritative for website host placement and edge deployment. Where an older website task mentions `65.109.65.169`, `10.40.0.1`, Caddy, or host port `3100`, this override controls.

## Target

```text
Production host: 37.27.128.39
Private host: 10.40.0.4
Public edge: existing Nginx + Certbot
Website production loopback port: 18110 after free-port verification
Website staging loopback port: 18111 after free-port verification
```

Do not install or activate Caddy on this host. Do not reuse port 3100; it is assigned to another service in the known provider-host topology.

## Existing services are protected

Before deployment, audit and preserve at minimum the Klyrow gateway, Postal, SMTP, Mautic, Grafana, billing, internal identity/private gateway, Kyqra, Nginx and certificate services. The website must not restart, remap, replace or expose them differently.

## Required hostname split

```text
klyrow.com / www.klyrow.com -> website container
app.klyrow.com               -> existing Klyrow application
api.klyrow.com               -> existing Klyrow API
a delivery/tracking hostname -> preserve audited current behavior
```

Do not route `app`, `api`, `track` or `bounce` to the public marketing website.

## Runtime requirements

- Deploy the website by immutable image digest.
- Bind the website to loopback only.
- Use a non-root, capability-dropped, no-new-privileges container.
- Use read-only root filesystem and tmpfs where practical.
- Add health/readiness, graceful shutdown, resource limits and log rotation.
- Keep source checkout under `/srv/codex-workspaces/klyrow-Website-`.
- Keep live releases under `/srv/klyrow-website/releases/<sha>` with `current` and `previous` pointers.
- Never build in the live release directory.

## Edge requirements

Use Nginx host-specific server blocks and preserve the existing Certbot-managed certificate paths unless the audited certificate requires a reviewed renewal or expansion.

Before reload:

1. back up the complete Nginx configuration;
2. record checksums;
3. validate the complete merged configuration;
4. prove the website candidate is healthy;
5. prove existing Klyrow services are healthy.

Only a graceful Nginx reload is permitted. Do not restart the complete Docker daemon or provider stack.

## Cross-repository requirement

The website repository owns the website runtime. The existing edge configuration is also represented in `appolon1908-hue/klyrow.com`. Any final production Nginx change must be traceable to reviewed source and included in the release evidence.

## Release gates

Production apex activation requires:

```text
EXACT_RELEASE_SHA=PASS
IMMUTABLE_IMAGE_DIGEST=PASS
CI=PASS
STAGING_ON_18111_OR_APPROVED_PORT=PASS
WEBSITE_HEALTH_READY=PASS
NGINX_BACKUP=PASS
NGINX_VALIDATE=PASS
APEX_AND_WWW=PASS
APP_AND_API_UNCHANGED=PASS
TRACK_AND_BOUNCE_UNCHANGED=PASS
POSTAL_SMTP_MAUTIC_GRAFANA_KYQRA_HEALTH=PASS
RESOURCE_HEADROOM=PASS
FORM_DURABILITY=PASS
ROLLBACK_REHEARSAL=PASS
OWNER_GO=PASS
```

Missing DNS, certificate, host capacity, secret files, reviewed edge source, middleware credentials, Odoo/n8n test routes or rollback evidence is a blocker. Do not invent or bypass it.

## Branch ownership

```text
ops/docker-runtime             -> build and stage website container on provider host
ops/provider-host-nginx-edge   -> prepare, validate and rehearse Nginx host split
release/website-production-v1  -> switch public apex after all gates
```

`ops/caddy-edge` is superseded and must not deploy to `37.27.128.39`.
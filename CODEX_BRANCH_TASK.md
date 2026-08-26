# Codex Branch Task — Caddy Edge, HTTPS and Rollback

## Branch

```text
ops/caddy-edge
```

## Prerequisite

Update from accepted `ops/docker-runtime` work before implementation.

## Objective

Create and stage the Klyrow-only Caddy edge configuration and safe backup/validate/reload/rollback tooling. Do not activate public production traffic in this branch.

## Required implementation

- Audit script for the actual Caddy installation, service unit, config/import structure and occupied listeners.
- Complete Caddy configuration backup with timestamp/checksum.
- Klyrow-only site fragment for `klyrow.com` and `www.klyrow.com`.
- `www` permanent redirect to apex.
- Reverse proxy to loopback/private Docker upstream.
- Request-ID forwarding.
- zstd/gzip compression.
- Immutable caching for hashed assets.
- no-cache/private behavior for HTML, API and sensitive responses as appropriate.
- Security headers compatible with Nuxt and approved integrations.
- Form request body limits.
- Privacy-safe access logs and rotation.
- Friendly error behavior without internal upstream disclosure.
- Staging hostname/port configuration.
- `caddy fmt` and `caddy validate` checks.
- Health/readiness check before reload.
- Caddy-only graceful reload script.
- Rollback script restoring exact prior configuration.
- External smoke scripts for HTTPS, redirect, status, headers, assets, routes and safe form behavior.
- No unrelated site-block modification.

## Host target

Audit rather than assume:

```text
65.109.65.169
10.40.0.1
```

This branch may validate on staging. It must not take over public `klyrow.com` traffic.

## Required tests/evidence

- Existing Caddy config inventory.
- Backup path/checksum.
- Diff proves only Klyrow/import changes.
- `caddy fmt` result.
- `caddy validate` result.
- Staging TLS/HTTP checks where configured.
- Apex/`www` redirect behavior in staging/simulated host checks.
- Cache and security headers.
- Request body limits.
- Access-log privacy review.
- Docker upstream health and failure behavior.
- Reload without unrelated service restart.
- Rollback rehearsal and verification.
- Unrelated site health checks before and after.

## Git delivery

Push only this branch, open/update one draft PR and post exact audit, validation and rollback evidence. Stop before public production release.

## Prohibited

- No public DNS change.
- No public production activation.
- No full middleware stack restart.
- No unrelated Caddy site edits.
- No TLS private key commit.
- No Postal/Odoo/n8n/Keycloak changes.

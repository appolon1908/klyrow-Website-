# Klyrow Website — Provider-Host Nginx Deployment Contract

## Authority

This is the authoritative public-edge source contract for the Klyrow Website.

It supersedes the historical Caddy plan, the `65.109.65.169` target, and the public port-`3100` topology. `docs/CADDY_PRODUCTION_DEPLOYMENT.md` is non-authoritative historical material and must not be executed.

## Target topology

```text
Provider host: 37.27.128.39
Private network context: 10.40.0.4
Existing edge: Nginx + Certbot
Website production candidate: reviewed loopback port, preferred 127.0.0.1:18110
Website staging candidate: reviewed loopback port, preferred 127.0.0.1:18111
```

Preferred public result after a separately approved cutover:

```text
klyrow.com / www.klyrow.com -> Klyrow public website
app.klyrow.com               -> existing authenticated Klyrow application
api.klyrow.com               -> existing Klyrow API
track / bounce               -> existing audited delivery behavior
```

No port or hostname is reserved merely because it appears in this document. A read-only host audit must verify listeners, server blocks, certificates, filesystem paths, container names, and protected services before any candidate configuration is prepared.

## Non-negotiable protections

The website change must preserve:

- existing Nginx and Certbot ownership;
- `app.klyrow.com` and `api.klyrow.com`;
- tracking and bounce routes;
- Postal web/SMTP and Mautic services;
- billing, identity/private gateway, Kyqra, Grafana, and monitoring;
- unrelated virtual hosts;
- firewall and private-network policy;
- the public website's public-only authentication boundary.

Do not install Caddy, perform a full-stack restart, bind the website container directly to a public interface, or modify an unrelated server block.

## Read-only discovery

Before an apply candidate exists, collect and review:

- host identity and hashed machine identifier;
- `ss`/listener inventory;
- Nginx version, prefix, included files, and active `nginx -T` output;
- Certbot certificate inventory and expiry;
- container/service inventory without exposing secret values;
- current health of app/API/track/bounce and protected services;
- available loopback ports;
- filesystem ownership/mode for candidate and backup paths;
- current public DNS and HTTPS behavior.

Discovery must not run as unrestricted root, print credentials, restart services, or alter the host.

## Candidate preparation

1. Build the website once from an exact protected-main SHA.
2. Record the immutable digest, source labels, SBOM, provenance, vulnerability scan, configuration checksum, and previous digest.
3. Deploy that exact digest to staging-readonly on a verified loopback port.
4. Certify health, readiness, exact version readback, public routes, localized routes, account handoff, headers, accessibility, monitoring, and zero live effects.
5. Archive the complete current Nginx configuration and write its SHA-256 checksum off the live path.
6. Generate an isolated candidate server block that changes only the apex and `www` website routes.
7. Build a complete candidate Nginx prefix containing every required include and certificate reference.
8. Run `nginx -t` against that candidate prefix.
9. Compare protected server blocks and routes before requesting production approval.

No candidate may rely on guessed paths, mutable images, an arbitrary manifest input, or an unreviewed branch/tag.

## Edge behavior

The apex server must:

- terminate TLS with the reviewed existing certificate path;
- redirect `www.klyrow.com` to the canonical apex, or follow the separately approved canonical-host policy;
- proxy only to the immutable website workload on loopback;
- set forwarding headers deliberately;
- enforce bounded body/request timeouts;
- apply website security headers without weakening application/API routes;
- cache hashed static assets safely;
- use `no-store` for dynamic API/problem responses where applicable;
- preserve real client/request correlation without exposing internal topology;
- have dedicated access/error logs with bounded rotation.

The website server block must not capture `app`, `api`, `track`, `bounce`, or wildcard subdomains.

## Apply boundary

Production apply requires:

- unchanged exact source SHA and image digest;
- green source and staging evidence;
- successful backup and rollback rehearsal;
- protected production environment approval;
- verified DNS/TLS authority;
- healthy monitoring;
- an explicit change record and stop conditions.

Apply only the reviewed candidate through a narrowly scoped operator. The operator may validate, atomically install the approved website server block, and perform an Nginx-only reload. It must not expose a shell, Docker wildcard, broad filesystem access, or `NOPASSWD: ALL`.

## Post-apply checks

Immediately verify:

- apex HTTPS and canonical redirect;
- public and localized routes;
- assets and cache headers;
- security headers;
- application handoff to `app.klyrow.com`;
- app/API/track/bounce and protected-service health;
- website logs and monitoring;
- zero unexpected write or provider effects.

Continue a bounded soak with explicit latency/error and protected-service thresholds.

## Automatic rollback

Restore the exact checksummed Nginx backup and previous immutable website digest on any:

- Nginx syntax/reload failure;
- source/digest/version mismatch;
- HTTPS/certificate/hostname failure;
- apex route or asset failure;
- app/API/track/bounce regression;
- protected-service degradation;
- monitoring loss;
- security-header or authentication-boundary regression;
- unexpected external effect.

After rollback, re-run Nginx validation, public checks, protected-service checks, and exact version readback. Record RTO and configuration integrity.

## Safety

This document is source guidance only. It performs no host discovery, container start, Nginx edit/reload, DNS change, certificate action, provider activation, email delivery, database mutation, or production traffic shift.

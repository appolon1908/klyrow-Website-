# Codex Branch Task — Klyrow Website Production V1 on Provider Host

## Branch

```text
release/website-production-v1
```

## Prerequisites

Do not implement or deploy until every selected feature, performance, Docker and `ops/provider-host-nginx-edge` PR is independently reviewed and merged into the exact release candidate.

`ops/caddy-edge` is superseded and is not a release prerequisite.

## Production target

```text
Host: 37.27.128.39
Private IP: 10.40.0.4
Edge: existing Nginx + Certbot
Website upstream: 127.0.0.1:18110 after free-port verification
Staging upstream: 127.0.0.1:18111 after free-port verification
```

Read `CODEX_PROVIDER_HOST_DEPLOYMENT_TASK.md` and `docs/PROVIDER_HOST_NGINX_DEPLOYMENT.md` completely. Their deployment rules override older Caddy/host/port instructions.

## Objective

Integrate the reviewed Klyrow public website, certify it on the provider host in staging, switch only apex/`www` website traffic through existing Nginx, verify production, and retain a proven rollback path.

This authorization applies only to the public website. It does not authorize live email changes, Postal/SMTP changes, real billing, Odoo accounting mutation, unrestricted n8n activation, Keycloak changes, Kyqra changes or unrelated infrastructure changes.

## Mandatory release inputs

Record:

- exact release SHA and immutable image digest;
- SBOM, scans, provenance and checksums;
- exact reviewed PR heads;
- migration statement;
- configuration inventory without secret values;
- provider-host listener/service/container inventory;
- complete current Nginx config and checksum-verified backup;
- certificate names/expiry without private material;
- current behavior of apex, `www`, `app`, `api`, `track` and `bounce`;
- local health of Klyrow gateway, Postal, SMTP, Mautic, Grafana and Kyqra;
- previous website release and rollback target;
- host resource headroom.

## Application certification

- type check, lint, unit/component/integration/contract tests;
- Nuxt production build and prerender;
- exact localized marketing/legal route counts;
- CTA/form/API/legal/cookie registry checks;
- idempotency/problem/security tests;
- interactive-tool no-side-effect tests;
- legal approval state and noindex/index rules.

## Browser and quality certification

- mobile/tablet/laptop/wide-desktop Playwright;
- axe and manual keyboard/WCAG 2.2 AA;
- Lighthouse and bundle/image/font budgets;
- broken links, canonical, hreflang, sitemap, robots and structured data;
- cookie preference and analytics network behavior.

## Integration certification

- durable middleware acceptance for each form type in approved test/staging mode;
- duplicate/idempotency, rejection and timeout behavior;
- approved Odoo CRM/helpdesk/privacy-case mappings;
- approved non-authoritative n8n routing/notification results;
- no real invoice, payment, entitlement, live email or production billing action.

## Container and provider-host edge certification

- immutable image digest;
- non-root/read-only/capability-free runtime;
- loopback-only staging/production ports;
- health/readiness, SIGTERM and restart recovery;
- image scan and SBOM;
- staging deployment and rollback rehearsal;
- preferred ports proven free or approved alternatives recorded;
- complete Nginx backup and full config validation;
- DNS and ports 80/443;
- TLS, cache, compression, security and body-limit headers;
- `app` and `api` unchanged;
- `track` and `bounce` unchanged;
- Klyrow gateway, Postal, SMTP, Mautic, Grafana and Kyqra healthy before and after;
- resource headroom and soak monitoring.

## Production algorithm

1. Confirm exact reviewed release and explicit owner GO.
2. Verify provider-host identity and isolated website release workspace.
3. Verify required secret files without printing values.
4. Audit listeners and prove the website port is free.
5. Capture current Nginx, certificate, container, hostname and protected-service evidence.
6. Back up the complete Nginx configuration with checksums.
7. Pull the exact immutable image digest.
8. Start the website candidate on loopback.
9. Run local health/readiness, routes, assets and form-safe smoke tests.
10. Validate the complete host-specific Nginx candidate.
11. Reverify app/api/track/bounce and all protected services.
12. Install only the reviewed apex/`www` website host split.
13. Run full Nginx validation.
14. Gracefully reload Nginx only.
15. Run external apex, `www`, TLS, route, asset, API-health and durable-form tests.
16. Monitor website and existing Klyrow services during soak.
17. Mark the website release current only after success.
18. Preserve the previous website release, Nginx backup and evidence.

## Stop and rollback conditions

- chosen port is occupied;
- Nginx validation fails;
- health/readiness or durable forms fail;
- apex/`www`/TLS regression;
- app/api/track/bounce regression;
- Klyrow, Postal, SMTP, Mautic, Grafana or Kyqra degradation;
- material 5xx, latency, memory, CPU, disk or log regression;
- missing secret, certificate, DNS, approved integration, artifact, review or rollback evidence.

Rollback restores the checksum-verified prior Nginx config and prior website release, validates Nginx, gracefully reloads Nginx only, and verifies every protected hostname/service. Do not restart the Docker daemon or provider stack.

## Required final report

Provide:

1. host, IPs, listener inventory and directories;
2. release SHA, digest, checksums, scans and SBOM;
3. reviewed PRs and heads;
4. routes/locales/sitemaps/legal states;
5. CTA/form/API/cookie registry results;
6. type/lint/test/build/browser/accessibility/Lighthouse results;
7. middleware/Odoo/n8n approved test evidence;
8. container security and staging rollback evidence;
9. Nginx backup, diff, validation and reload evidence;
10. DNS/TLS/HTTP/cache/header evidence;
11. app/api/track/bounce unchanged evidence;
12. Klyrow/Postal/SMTP/Mautic/Grafana/Kyqra health evidence;
13. resource/soak evidence;
14. exact rollback command and target;
15. blockers/limitations;
16. confirmation that Caddy was not installed or activated;
17. confirmation that live email, Postal, SMTP, billing, Odoo accounting and unrelated services were unchanged.

Do not claim completion if any gate is missing or unmeasured.
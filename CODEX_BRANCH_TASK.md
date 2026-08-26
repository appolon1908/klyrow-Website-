# Codex Branch Task — Klyrow Website Production V1

## Branch

```text
release/website-production-v1
```

## Prerequisites

Do not implement or deploy from this branch until every selected feature, performance, Docker and Caddy PR is independently reviewed and merged into the exact release candidate.

## Objective

Integrate the reviewed Klyrow public website, certify it in staging, deploy the public website to production, verify it, and retain a proven rollback path.

This authorization applies only to the public website. It does not authorize live email delivery, Postal changes, real billing, Odoo accounting mutations, unrestricted n8n activation, Keycloak changes or unrelated infrastructure changes.

## Mandatory release inputs

Record:

- exact release commit SHA;
- immutable image digest;
- SBOM and scan artifacts;
- source and image checksums;
- reviewed PR list and exact heads;
- migration statement (`none` if no website persistence migration);
- environment/configuration inventory without values;
- current production Caddy/container/release state;
- previous known-good release and rollback target.

## Required certification

### Application

- Type check, lint, unit/component/integration tests.
- Nuxt production build and prerender.
- Exact route count: 46 English and 46 Spanish indexable pages.
- Localized route equivalence.
- CTA registry validation.
- Form registry and endpoint validation.
- API contract/problem/idempotency/security tests.
- Interactive-tool no-side-effect tests.

### Browser and quality

- Mobile/tablet/laptop/wide-desktop Playwright matrix.
- axe accessibility with no serious/critical violations.
- WCAG 2.2 AA manual keyboard checks.
- Lighthouse CI and exact scores.
- Bundle/image/font budgets.
- Broken-link, canonical, hreflang, sitemap, robots and structured-data checks.
- Consent/analytics network verification.

### Integrations

- Durable middleware acceptance for each form type in approved test/staging mode.
- Duplicate/idempotency test.
- Middleware rejection/timeout behavior.
- Odoo approved test-mode contact/lead/activity/support mappings.
- n8n approved test-mode notification/routing results.
- No real invoice, payment, product entitlement or live email action.

### Container and edge

- Immutable image digest.
- Non-root/read-only runtime checks.
- Health/readiness.
- SIGTERM and restart recovery.
- Image scan and SBOM.
- Staging deployment and rollback rehearsal.
- Complete Caddy backup.
- Caddy fmt/validate.
- DNS for apex and `www`.
- Ports 80/443 reachability.
- TLS issuance/readiness.
- Cache, compression, security and body-limit headers.
- Unrelated site health before/after.

## Production deployment algorithm

1. Confirm all gates and exact release authorization.
2. Confirm host identity and isolated release workspace.
3. Confirm required secrets/configuration exist without printing values.
4. Confirm DNS and Caddy ownership.
5. Capture current production evidence and backup Caddy.
6. Pull exact immutable image digest.
7. Start candidate on isolated upstream.
8. Run local health/readiness and route/form-safe smoke tests.
9. Validate complete Caddy configuration.
10. Switch only the Klyrow upstream/site fragment.
11. Reload Caddy only.
12. Run external apex, `www`, TLS, route, asset, API health and form tests.
13. Monitor logs, health, latency and resource usage during soak.
14. Mark current release only after success.
15. Preserve previous release and evidence.

## Automatic stop/rollback conditions

- Health/readiness failure.
- Broken home, pricing, localized routes or form endpoints.
- Elevated 5xx rate.
- Durable middleware form failure.
- TLS/Caddy failure.
- Severe rendering/accessibility regression.
- Resource saturation caused by candidate.
- Unrelated site/service regression.
- Missing required secret, DNS, Odoo/n8n approval or exact artifact.

On a stop condition, execute the rehearsed rollback and verify the previous site state. Do not improvise destructive remediation.

## Required final report

Provide:

1. host, IPs and directories;
2. release SHA, image digest, checksums and SBOM;
3. reviewed PRs and commits;
4. exact routes/locales/sitemaps;
5. CTA/form/API registry results;
6. type/lint/test/build results;
7. browser/accessibility/Lighthouse/bundle results;
8. SEO/link/structured-data results;
9. middleware durability evidence;
10. Odoo/n8n approved test evidence;
11. image/container/security/secret-scan results;
12. staging and rollback evidence;
13. Caddy backup/validate/reload results;
14. DNS/TLS/HTTP/header evidence;
15. production smoke and soak results;
16. analytics/consent verification;
17. exact rollback command and current rollback target;
18. known limitations and follow-ups;
19. confirmation that unrelated services remained healthy;
20. confirmation that live email delivery, Postal, real billing and Odoo accounting were unchanged.

Do not claim completion if any gate is missing, bypassed or unmeasured.
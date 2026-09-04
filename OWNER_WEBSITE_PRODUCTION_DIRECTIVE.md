# Owner Directive — Build and Launch the Klyrow Public Website

Date: 2026-09-04

Repository:

```text
appolon1908-hue/klyrow-Website-
```

## Current authority

The owner directs repository work to continue from the exact current `main` authority:

- Horizon public shell and public-only authentication boundary;
- authenticated application authority at `app.klyrow.com` / `appolon1908-hue/klyrow.com`;
- existing provider-host Nginx + Certbot edge on `37.27.128.39`;
- immutable, non-root website image on a reviewed loopback port;
- exact-head CI, staging-readonly certification, backup, rollback, and protected production approval.

The earlier instruction to deploy this website through a Caddy host is superseded. Do not install Caddy, use the old `65.109.65.169` topology, bind the website publicly on port 3100, or execute `docs/CADDY_PRODUCTION_DEPLOYMENT.md`.

## Directed work

Codex may continue the website build-out without another routine instruction when the previous exact head is green and there are no unresolved critical findings, merge conflicts, missing required reviews, or external blockers.

The directed sequence is:

1. reconcile localized English/Spanish content onto the current Horizon shell;
2. add configuration-driven pricing and validated CTA contracts;
3. add the modular public BFF and durable form intake;
4. reconcile legal, privacy, cookies, Middleware integration, tools, SEO, analytics, accessibility, and performance;
5. reconcile immutable Docker and provider-host Nginx source contracts;
6. build one exact protected-main release candidate;
7. deploy that exact digest to staging-readonly;
8. verify routes, security, application handoff, integrations, monitoring, zero live effects, backups, restore, and rollback;
9. promote only through a separately approved production read-only canary;
10. provide the complete release and rollback evidence.

Historical stacked branches are source candidates only. They must be selectively ported from current `main`; stale shells, browser identity clients, Caddy files, workflows, images, and release assumptions must not be replayed wholesale.

## Required boundaries

This directive authorizes repository implementation and approved website release work only. It does **not** authorize:

- browser storage of access, refresh, or ID tokens;
- direct browser calls to Odoo, n8n, Postal, Mautic, or private provider services;
- live email-delivery changes;
- Postal/Mautic source or configuration changes;
- production billing or payment collection;
- posting Odoo invoices, payments, or credits;
- arbitrary n8n workflow activation;
- Keycloak production identity changes;
- DNS changes without verified authority and a protected change approval;
- installation of Caddy or modification of unrelated Nginx sites/services;
- deployment of mutable tags or rebuilding between staging and production;
- bypassing CI, staging, security, integration, DNS, TLS, Nginx, backup, monitoring, or rollback gates;
- fabrication of credentials, approvals, test results, immutable digests, or runtime evidence.

If a required external value or authorization is absent, stop that affected runtime step, record the exact blocker, and leave the last known-good public website and protected services unchanged.

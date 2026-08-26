# Owner Directive — Build and Launch the Klyrow Public Website

Date: 2026-08-26

Repository:

```text
appolon1908-hue/klyrow-Website-
```

The repository owner directs Codex to:

1. implement the complete public website program defined in this branch;
2. use the clean branch sequence in `docs/BRANCH_AND_DELIVERY_PLAN.md`;
3. push each implementation branch to GitHub;
4. open or update the corresponding pull request;
5. run and record every required test and acceptance gate;
6. integrate only reviewed, green website changes into `release/website-production-readiness`;
7. deploy the public website to `klyrow.com` through the audited Caddy host after all gates pass;
8. run post-deployment verification and roll back automatically/manual immediately when a stop condition is met;
9. provide the complete production report.

Codex may proceed through the website branch sequence without requesting another routine instruction when the previous branch's required checks are green and there are no unresolved critical findings, merge conflicts, missing required reviews or external blockers.

This directive authorizes only the Klyrow public website and its approved lead-routing integration.

It does **not** authorize:

- live email-delivery changes;
- Postal source/configuration changes;
- production billing or payment collection;
- posting Odoo invoices/payments/credits;
- arbitrary n8n workflow activation;
- Keycloak production identity changes;
- DNS changes without verified authority;
- modifications to unrelated Caddy sites or services;
- bypassing CI, staging, security, integration, DNS, TLS, Caddy or rollback gates;
- fabrication of credentials, approvals, test results or external configuration.

If a required external value or authorization is absent, Codex must stop that affected step, report the exact blocker and leave the last known-good public website unchanged.
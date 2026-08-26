# Codex Branch Mission — Website Production Readiness and Release

Branch: `release/website-production-readiness`

This is the only branch authorized to activate the public Klyrow website after all gates pass.

Before deployment:

- recreate/update from all independently reviewed website feature and operations branches;
- record exact release SHA and immutable artifact;
- verify complete CI;
- deploy/certify staging;
- confirm durable form routing through middleware with approved Odoo/n8n test results;
- confirm DNS for `klyrow.com` and `www.klyrow.com`;
- audit/back up existing Caddy config;
- validate rollback.

Required production work:

- deploy only the public website runtime;
- atomically switch the immutable release;
- validate and gracefully reload only Caddy as required;
- verify HTTPS and canonical redirect;
- run route, locale, SEO, mobile, accessibility, Lighthouse and form smoke tests;
- prepare/perform sitemap and Search Console handoff with authorized access;
- monitor release and roll back on any stop condition;
- provide the complete report in `CODEX_WEBSITE_PRODUCTION_TASK.md`.

Authorization:

```text
PUBLIC_KLYROW_WEBSITE_DEPLOYMENT=AUTHORIZED_AFTER_ALL_GATES_PASS
LIVE_EMAIL_DELIVERY_CHANGES=NOT_AUTHORIZED
PRODUCTION_BILLING_CHANGES=NOT_AUTHORIZED
POSTAL_CHANGES=NOT_AUTHORIZED
UNRELATED_CADDY_SITE_CHANGES=NOT_AUTHORIZED
```

Missing DNS, credentials, middleware/Odoo/n8n identifiers, reviews, host access or production secrets are blockers. Do not fabricate or bypass them. Do not merge to `main` or declare completion until external production checks and rollback evidence pass.
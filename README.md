# Klyrow Website

Public marketing website repository for Klyrow.

## Current status

```text
PLANNING_AND_BRANCH_SCAFFOLDS=AVAILABLE
APPLICATION_IMPLEMENTATION=NOT_COMPLETE
MAIN_RELEASE_BASELINE=NOT_READY
STAGING_DEPLOYMENT=NOT_ACTIVE
PRODUCTION_DEPLOYMENT=NOT_ACTIVE
PUBLIC_WEBSITE_LIVE=NO
```

The Nuxt/Vue application, APIs, forms, middleware integration, legal pages, Docker runtime, Caddy edge configuration, staging evidence, and production release must be implemented and reviewed through the branches tracked in Issue #3.

Do not deploy `main` in its current state. The default branch currently serves only as the repository baseline and contains no production website application.

Authoritative planning and implementation contracts are maintained on `planning/production-website-blueprint`. Production activation is permitted only from the final reviewed release branch after CI, staging, DNS, TLS, Caddy, middleware, Odoo/n8n test routing, accessibility, performance, security, and rollback gates pass.

# Klyrow Website

Production public website for Klyrow, the governed customer-communications platform built with Nuxt 4/Vue 3 and integrated through Codestra middleware with Odoo and non-authoritative n8n automation.

## Current status

```text
PLANNING=COMPLETE_V2
APPLICATION_IMPLEMENTED=NO
DOCKER_RUNTIME_IMPLEMENTED=NO
PRODUCTION_DEPLOYED=NO
```

The repository intentionally separates heavy features into focused branches and draft PRs. Empty branch/task scaffolds are not completed application code.

## Authoritative documents

- `CODEX_WEBSITE_PRODUCTION_TASK.md`
- `CODEX_WEBSITE_HARDENING_AND_DOCKER_TASK.md`
- `docs/BRANCH_AND_DELIVERY_PLAN.md`
- `docs/API_FORM_CTA_CONTRACT.md`
- `docs/ENHANCED_FEATURES_AND_BRANCHES.md`
- `docs/DOCKER_RUNTIME_AND_DEPLOYMENT.md`
- `docs/SITEMAP_CONTENT_AND_DESIGN.md`
- `docs/FORMS_MIDDLEWARE_ODOO_N8N.md`
- `docs/SEO_PERFORMANCE_AND_TRACKING.md`
- `docs/CADDY_PRODUCTION_DEPLOYMENT.md`

## Clean implementation order

```text
feat/site-shell-design-system
feat/content-localization-pages
feat/feature-pricing-conversion
feat/public-api-bff
feat/forms-conversion-engine
feat/middleware-odoo-n8n
feat/interactive-tools
feat/seo-structured-data
feat/analytics-consent
perf/core-web-vitals-accessibility
ops/docker-runtime
ops/caddy-edge
release/website-production-v1
```

Start with draft PR #4 and stop after each branch for review.

## Codex launcher

Run on the Codestra middleware/Caddy server:

```bash
ssh root@65.109.65.169

tmux new-session -A -s klyrow-website-v2

set -Eeuo pipefail
launcher="$(mktemp /tmp/klyrow-website-v2.XXXXXX)"
curl -fsSL \
  "https://raw.githubusercontent.com/appolon1908-hue/klyrow-Website-/aaeeb1e80bbaf72420d4bf4acfd8e83345a794da/scripts/start-codex-website-v2.sh" \
  -o "$launcher"
bash "$launcher"
```

This launcher starts only `feat/site-shell-design-system`. Public production deployment is permitted only from `release/website-production-v1` after every gate passes.

## Safety boundaries

- Browser never calls Odoo or n8n directly.
- No direct Odoo database writes.
- No secrets in Git or public runtime configuration.
- No live email-delivery, Postal, real billing or unrelated service changes.
- No feature/ops branch deploys public production.

# Codex Production Mission — Klyrow Public Website

## Mission

Build, test and deploy the public Klyrow website:

```text
https://klyrow.com
https://www.klyrow.com -> permanent redirect to https://klyrow.com
```

Repository:

```text
https://github.com/appolon1908-hue/klyrow-Website-
```

The repository began empty. Do not assume the application exists. Build it from the contracts in this planning branch.

The owner authorizes production activation of the **public website only** after all gates pass. This does not authorize live email-delivery changes, Postal changes, real billing, Odoo accounting changes, unrestricted n8n activation or changes to unrelated production applications.

## Mandatory reading

Read completely before editing:

1. `CODEX_WEBSITE_PRODUCTION_TASK.md`
2. `docs/BRANCH_AND_DELIVERY_PLAN.md`
3. `docs/SITEMAP_CONTENT_AND_DESIGN.md`
4. `docs/FORMS_MIDDLEWARE_ODOO_N8N.md`
5. `docs/SEO_PERFORMANCE_AND_TRACKING.md`
6. `docs/CADDY_PRODUCTION_DEPLOYMENT.md`
7. the active branch's `CODEX_BRANCH_TASK.md`

Before editing, inventory every requirement as:

```text
IMPLEMENTED
PARTIAL
MISSING
BLOCKED
NOT_APPLICABLE
```

## Technology baseline

Use:

- Nuxt 4, Vue 3 and TypeScript;
- Node.js 22 active LTS or a later supported active LTS;
- pnpm through Corepack with committed `pnpm-lock.yaml`;
- Nitro SSR and route-level prerendering;
- same-origin Nuxt server APIs;
- Vitest/Nuxt test utilities;
- Playwright;
- axe accessibility checks;
- Lighthouse CI;
- Caddy as the production TLS reverse proxy;
- Codestra middleware as the only boundary to Odoo and n8n.

Do not use Nuxt 3. Do not build a client-only SPA for indexable content.

## Product scope

Implement:

- 46 unique English indexable content pages;
- 46 complete Spanish equivalents under `/es`;
- 92 localized indexable URLs;
- four legal/policy pages per locale;
- noindex form-confirmation and error routes;
- five distinct audience landing experiences:
  - developers;
  - marketing teams;
  - agencies/resellers;
  - enterprise;
  - Odoo and automation teams;
- one dedicated page for every feature in the route inventory;
- pricing page with configuration-driven plans;
- `Contact sales` pricing mode until owner-approved numbers are supplied;
- demo, contact, pricing, developer-interest, partner, support and newsletter forms;
- English and Spanish navigation/content/forms;
- responsive layouts for mobile, tablet, laptop and desktop.

Use an original, colorful, spacious Klyrow design inspired by premium editorial technology sites without copying Apple code, assets, wording, trademarks or distinctive page compositions.

Do not ship fake customer logos, testimonials, prices, reviews, ratings, certifications, awards or performance statistics.

## Form and back-office boundary

Required flow:

```text
Browser
  -> Nuxt same-origin /api/v1 endpoint
  -> authenticated Codestra middleware
  -> durable middleware inbox/outbox
  -> Odoo 19 CRM/contact/activity adapter
  -> optional non-authoritative n8n automation
```

Every form requires:

- server-side typed validation;
- idempotency key;
- request/submission/event IDs;
- origin/CSRF protection;
- rate limits;
- honeypot and minimum-completion-time checks;
- optional CAPTCHA adapter;
- explicit service-contact and marketing-consent separation;
- source, locale, referrer and approved UTM capture;
- accessible pending/success/failure states;
- honest retryable failure when middleware durable acceptance did not occur.

Never expose or commit Odoo, n8n, middleware, Postal or Keycloak credentials. Never call Odoo or n8n directly from the browser. Never write directly to Odoo PostgreSQL. n8n is not authoritative.

## SEO and Google acceptance

Implement:

- meaningful SSR/prerendered HTML;
- unique titles, descriptions and social metadata;
- canonical URLs;
- reciprocal English/Spanish hreflang plus `x-default`;
- sitemap index and locale sitemaps;
- robots.txt;
- real 404 behavior;
- crawlable ordinary links;
- Organization and WebSite JSON-LD where accurate;
- BreadcrumbList JSON-LD on hierarchical pages;
- SoftwareApplication/FAQ markup only when visible content and current Google rules support it;
- Search Console verification through environment configuration;
- broken-link, metadata, sitemap and structured-data tests;
- no keyword stuffing, hidden text, doorway pages or thin duplicated pages.

A site can meet Google's technical requirements without Google guaranteeing indexing, ranking or rich results. Report measured facts only.

## Tracking

Create a consent-aware analytics abstraction. GTM/GA4 must be optional and environment configured.

Track approved non-sensitive events such as:

```text
page_view
cta_click
pricing_cta_click
form_start
form_validation_error
form_submit
form_submit_success
form_submit_failure
language_change
resource_download
popup_view
popup_submit
```

Never send passwords, complete emails, complete phones, message bodies, API keys or credentials to analytics. Optional analytics must not load before consent when policy requires consent.

## Performance and accessibility

Target Core Web Vitals good thresholds:

```text
LCP <= 2.5 seconds
INP <= 200 milliseconds
CLS <= 0.1
```

Lighthouse CI mobile minimums on home, pricing, one solution and one feature page:

```text
Performance >= 95
Accessibility = 100
Best Practices >= 95
SEO = 100
```

Budgets:

```text
Initial compressed JavaScript <= 180 KB
Initial compressed CSS <= 70 KB
Critical font transfer <= 100 KB
No single above-fold raster image > 180 KB
No third-party analytics JavaScript before consent
```

Meet WCAG 2.2 AA: skip link, keyboard-complete navigation, logical headings, labels/descriptions, visible focus, contrast, reduced motion, dialog focus management, live form status, 200% zoom and mobile touch targets.

Do not claim a PageSpeed/Lighthouse score that was not measured. Record failures and reviewed exceptions honestly.

## Security

Implement:

- strict validation and output encoding;
- CSRF/origin controls;
- rate/body limits;
- safe redirect allowlist;
- CSP/security headers;
- no arbitrary URL fetching or open proxy;
- secrets only in approved files/managers;
- dependency, container and secret scans;
- non-root production runtime;
- privacy-safe logs;
- no sensitive form bodies in logs.

## Clean branch order

Follow exactly:

```text
planning/production-website-blueprint
feat/nuxt4-marketing-site
feat/website-odoo-n8n-forms
feat/website-seo-performance
ops/caddy-production
release/website-production-readiness
```

Before implementing each branch, recreate/update it from its latest reviewed prerequisites. One independently reviewable PR per implementation branch. Push the branch, post exact evidence and stop before the next branch unless explicitly instructed to continue from an accepted baseline.

## CI/CD

Required checks:

1. frozen lock-file install;
2. type check;
3. lint;
4. unit/component tests;
5. Nuxt build and prerender validation;
6. route and broken-link tests;
7. metadata/sitemap/structured-data tests;
8. Playwright browser tests;
9. axe accessibility tests;
10. Lighthouse CI;
11. secret scan;
12. dependency audit;
13. container build/scan;
14. SBOM;
15. immutable artifact publication only from an explicitly dispatched release workflow.

No pull-request workflow may deploy directly to production.

## Production host and runtime

Preferred host to audit:

```text
Codestra middleware/Caddy server
public IP: 65.109.65.169
private IP: 10.40.0.1
```

Preferred runtime:

```text
Caddy :80/:443
  -> 127.0.0.1:3100
  -> Nuxt/Nitro Node process
  -> same-origin server APIs
  -> authenticated middleware
```

Use an isolated source checkout. Do not develop in `/srv/klyrow-website`, `/var/www`, `/opt/klyrow` or an existing production checkout.

## Production gates

Only `release/website-production-readiness` may activate the public site, after:

```text
REVIEWED_FEATURE_PRS=PASS
CI=PASS
STAGING=PASS
ROUTE_AND_LOCALE_COUNTS=PASS
MOBILE_AND_DESKTOP=PASS
ACCESSIBILITY=PASS
SEO_VALIDATION=PASS
LIGHTHOUSE=PASS_OR_REVIEWED_EXCEPTION
FORM_API=PASS
MIDDLEWARE_DURABILITY=PASS
ODOO_TEST_OR_APPROVED_ROUTE=PASS
N8N_TEST_OR_APPROVED_ROUTE=PASS
DNS=PASS
CADDY_BACKUP=PASS
CADDY_VALIDATE=PASS
TLS=PASS
HEALTH_AND_READINESS=PASS
ROLLBACK_REHEARSAL=PASS
UNRELATED_SERVICES_UNCHANGED=PASS
```

DNS for `klyrow.com` and `www.klyrow.com` must resolve to the intended Caddy host and ports 80/443 must be reachable. Back up and validate the complete existing Caddy configuration. Add/update only the Klyrow website fragment. Do not restart the complete middleware stack.

If DNS, host access, middleware credentials, Odoo mappings, n8n identifiers, Search Console authorization or production secrets are missing, report the precise blocker. Do not invent or bypass it.

## Required final report

Provide:

1. hostname/IPs and isolated working directory;
2. repository remote;
3. branch starting/final SHAs and commits;
4. final release SHA/artifact/checksums;
5. changed files;
6. exact English/Spanish route and sitemap counts;
7. responsive screenshots/evidence;
8. type-check/lint/unit/build results;
9. Playwright/accessibility results;
10. Lighthouse results per route/profile;
11. link/SEO/sitemap/structured-data results;
12. form and middleware durability evidence;
13. Odoo/n8n approved test evidence;
14. security/dependency/container/secret-scan results;
15. staging evidence;
16. DNS/TLS/Caddy validation/reload evidence;
17. production status checks;
18. analytics/consent verification;
19. rollback command and rehearsal;
20. limitations/blockers;
21. confirmation that no live email delivery, Postal, real billing or unrelated service was changed.

Do not mark complete merely because the site builds.
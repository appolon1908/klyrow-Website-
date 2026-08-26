# Codex Production Mission — Klyrow Public Website

## 1. Mission

Build, test, deploy and verify the production public website for Klyrow at:

```text
https://klyrow.com
https://www.klyrow.com -> permanent redirect to https://klyrow.com
```

Repository:

```text
https://github.com/appolon1908-hue/klyrow-Website-
```

The repository was initialized as an empty project. Codex must create the website from the specifications in this branch rather than assuming application code already exists.

This authorization applies only to the public Klyrow website. It does **not** authorize live email sending, Postal changes, Odoo accounting changes, production billing, n8n workflow activation outside the website lead-routing scope, or changes to unrelated production applications.

## 2. Required reading

Read completely before editing:

1. `CODEX_WEBSITE_PRODUCTION_TASK.md`
2. `docs/BRANCH_AND_DELIVERY_PLAN.md`
3. `docs/SITEMAP_CONTENT_AND_DESIGN.md`
4. `docs/FORMS_MIDDLEWARE_ODOO_N8N.md`
5. `docs/SEO_PERFORMANCE_AND_TRACKING.md`
6. `docs/CADDY_PRODUCTION_DEPLOYMENT.md`

Mark each requirement as `IMPLEMENTED`, `PARTIAL`, `MISSING`, `BLOCKED` or `NOT_APPLICABLE` before implementation and again at completion.

## 3. Mandatory technology baseline

Use:

- Nuxt 4 with Vue 3 and TypeScript;
- Node.js 22 LTS or later supported active LTS;
- pnpm through Corepack with a committed lock file;
- Nuxt/Nitro SSR with route-level prerendering for indexable marketing pages;
- reusable Vue components and data-driven content;
- server API routes as the same-origin website BFF;
- Caddy as the public TLS reverse proxy;
- the Codestra middleware as the sole boundary to Odoo and n8n;
- Vitest/Nuxt test utilities for unit/component tests;
- Playwright for critical browser flows;
- axe-based automated accessibility checks;
- Lighthouse CI for mobile and desktop performance budgets.

Do not use Nuxt 3. Do not build a client-only SPA for indexable pages.

## 4. Product and visual direction

Create an original Klyrow visual system inspired by the spacious editorial confidence of premium technology websites without copying Apple assets, text, page structure, trademarks or interaction details.

The product should feel:

- bold, colorful and optimistic;
- clean and highly readable;
- spacious, with large editorial typography;
- modern but not visually noisy;
- trustworthy enough for enterprise email infrastructure;
- playful in illustrations, gradients and microinteractions;
- fast and usable on low-end mobile devices;
- consistent across mobile, tablet, laptop and wide desktop.

Required characteristics:

- custom Klyrow wordmark treatment using text/SVG owned by the project;
- strong blue/violet core with controlled coral, cyan, lime and amber accents;
- neutral light surfaces with selective dark storytelling sections;
- generous whitespace and clear hierarchy;
- real product diagrams built from HTML/CSS/SVG rather than heavy video;
- subtle scroll and hover motion disabled or reduced under `prefers-reduced-motion`;
- one clear primary call to action per major section;
- no auto-playing audio;
- no blocking entrance animation;
- no misleading metrics, testimonials, customer logos or guarantees.

## 5. Website scope

Implement all routes in `docs/SITEMAP_CONTENT_AND_DESIGN.md`.

Launch target:

- 46 unique English indexable content pages;
- 46 complete Spanish equivalents under `/es`;
- 92 localized indexable URLs total;
- four legal/policy pages per locale;
- noindex utility routes for form confirmation and error handling;
- sitemap indexes that include only canonical indexable URLs;
- all pages reachable with ordinary crawlable links.

The five primary audience landing pages are:

1. developers;
2. marketing teams;
3. agencies and resellers;
4. enterprise teams;
5. Odoo and automation teams.

Each feature must have a dedicated linked page. The pricing page must be configuration driven and must not invent prices. Default production behavior is `Contact sales` until the owner supplies approved price values.

## 6. Navigation and conversion system

Desktop header:

- Product mega menu;
- Solutions mega menu;
- Integrations;
- Developers;
- Pricing;
- Resources;
- Sign in;
- primary `Start building` or `Request a demo` action.

Mobile header:

- accessible disclosure navigation;
- same route availability as desktop;
- focus trap only while the drawer is open;
- escape-to-close;
- background scroll lock;
- visible current route;
- no hidden mobile-only navigation gaps.

Global conversion components:

- sticky but non-obstructive header;
- hero CTA pair;
- mid-page contextual CTA;
- final CTA band;
- accessible exit-intent/engagement popup shown only after user engagement, never immediately;
- popup frequency cap stored without sensitive data;
- popup disabled for reduced-motion or when consent rules require it;
- no popups on legal pages, form success pages or small screens where it obscures content.

## 7. Forms

Implement reusable validated forms for:

- request a demo;
- contact sales;
- pricing consultation;
- developer/signup interest;
- reseller/partner application;
- support/general contact;
- newsletter subscription.

Every form must:

- submit to a same-origin `/api/v1/...` Nuxt server route;
- use an idempotency key;
- validate server-side with a typed schema;
- normalize email and phone fields;
- capture explicit consent evidence;
- include hidden honeypot and minimum-completion-time controls;
- enforce per-IP and per-email rate limits;
- support an optional CAPTCHA provider through environment configuration;
- capture landing page, referrer, locale and approved UTM fields;
- never expose middleware, Odoo or n8n credentials;
- return a stable submission ID;
- show accessible pending, success, validation, duplicate and retryable failure states;
- never show false success when durable middleware acceptance failed.

Detailed contracts are in `docs/FORMS_MIDDLEWARE_ODOO_N8N.md`.

## 8. Middleware, Odoo and n8n boundary

Browser -> Nuxt BFF -> Codestra middleware -> durable outbox -> Odoo/n8n.

Never:

- call Odoo directly from the browser;
- call n8n directly from the browser;
- put Odoo or n8n credentials in this repository;
- write directly to Odoo PostgreSQL;
- make n8n authoritative for lead or consent state;
- let an Odoo or n8n outage silently lose a lead.

The middleware must acknowledge only after durable persistence. Odoo receives approved customer/contact and CRM lead information. n8n may perform non-authoritative notifications, routing, enrichment and reminders. All external effects use idempotency and correlation IDs.

## 9. SEO and Google requirements

Implement:

- SSR/prerendered meaningful HTML;
- unique title, description, canonical, Open Graph and social metadata per route;
- English/Spanish hreflang pairs plus `x-default`;
- crawlable internal links;
- XML sitemap index and locale sitemaps;
- robots.txt;
- clean status codes and a real 404;
- Organization and WebSite JSON-LD on the home/about surface;
- BreadcrumbList JSON-LD on hierarchical pages;
- SoftwareApplication JSON-LD only where visible content supports every property;
- FAQ structured data only when visible FAQ content exists and only where current Google guidelines permit;
- no fabricated reviews, ratings, prices, awards, customers or statistics;
- no keyword stuffing, hidden text, doorway pages or duplicated thin pages;
- image alt text based on purpose, not keywords;
- Search Console verification through environment configuration;
- post-deploy sitemap submission instructions and verification evidence.

Use a page-level SEO content object rather than scattered hard-coded tags.

## 10. Analytics and tracking

Create a consent-aware analytics abstraction that can load Google Tag Manager/GA4 only when configured and legally permitted.

Required event names:

```text
page_view
cta_click
navigation_open
pricing_plan_view
pricing_cta_click
form_start
form_validation_error
form_submit
form_submit_success
form_submit_failure
language_change
resource_download
outbound_link
video_play
popup_view
popup_submit
```

Requirements:

- no tracking identifiers hard-coded in source;
- environment-configured GTM/GA4/Search Console values;
- consent state propagated before optional marketing analytics loads;
- no passwords, message text, full phone numbers or sensitive form values in analytics;
- UTM attribution normalized and sent with the lead event through middleware;
- first-party request IDs and submission IDs available for operational tracing;
- development and test traffic clearly excluded or labeled.

## 11. Performance budgets

Target Google Core Web Vitals good thresholds at the 75th percentile:

```text
LCP <= 2.5 seconds
INP <= 200 milliseconds
CLS <= 0.1
```

Lighthouse CI minimums on the tested mobile profile:

```text
Performance >= 95 on home, pricing and one representative feature page
Accessibility = 100
Best Practices >= 95
SEO = 100
```

Additional budgets:

```text
Initial compressed JavaScript <= 180 KB for the home route unless evidence justifies an exception
Initial compressed CSS <= 70 KB
No single above-fold raster image > 180 KB
No unoptimized animated GIF
No render-blocking third-party analytics before consent
No more than two font families
No more than four font files on initial route
```

Use responsive AVIF/WebP images with dimensions, lazy loading below the fold, preloaded critical local font subset only, code splitting, no heavy carousel library and no unbounded animation library.

A perfect PageSpeed score cannot be guaranteed for every network and device. Codex must provide the exact measured results, identify remaining bottlenecks and must not claim a score it did not measure.

## 12. Accessibility

Meet WCAG 2.2 AA and test:

- keyboard-complete navigation;
- skip link;
- headings in logical order;
- labels and descriptions for all controls;
- accessible menu and disclosure semantics;
- visible focus;
- color contrast;
- reduced motion;
- no content available only on hover;
- live regions for form status;
- focus movement after validation and route changes;
- dialog focus trap, escape close and focus restoration;
- touch target sizes;
- zoom to 200% without loss of content or function.

## 13. Security

Implement:

- strict input validation;
- output encoding;
- origin checks and CSRF protection for state-changing browser APIs;
- rate limiting;
- request body limits;
- safe redirect allowlist;
- security headers through Nuxt and Caddy;
- no open proxy behavior;
- no arbitrary URL fetching;
- no secrets in public runtime configuration;
- dependency and container scanning;
- gitleaks or equivalent secret scanning;
- non-root production process;
- read-only container filesystem where practical;
- structured logs without lead message bodies or credentials;
- privacy-safe request correlation.

## 14. CI/CD

Add GitHub Actions for:

1. lock-file installation;
2. type checking;
3. linting;
4. unit and component tests;
5. Nuxt build;
6. prerender route validation;
7. broken-link and metadata checks;
8. Playwright browser tests;
9. axe accessibility tests;
10. Lighthouse CI;
11. secret scan;
12. dependency audit;
13. container build;
14. container scan;
15. SBOM artifact;
16. immutable image/artifact publication only from an explicitly dispatched release workflow.

No pull-request workflow may deploy directly to production.

## 15. Branch execution order

Use the branches defined in `docs/BRANCH_AND_DELIVERY_PLAN.md` in this order:

```text
planning/production-website-blueprint
feat/nuxt4-marketing-site
feat/website-odoo-n8n-forms
feat/website-seo-performance
ops/caddy-production
release/website-production
```

One independently reviewable PR per implementation branch. Do not combine unrelated work into one huge unreviewable commit.

## 16. Production deployment authorization and limits

The owner has authorized production deployment of the **public website** after all required gates pass.

Production activation is allowed only from `release/website-production` after:

- all selected PRs are merged into the release candidate;
- CI is green;
- staging is verified;
- forms create durable middleware records and test-mode Odoo/n8n results;
- DNS for `klyrow.com` and `www.klyrow.com` points to the intended Caddy host;
- ports 80/443 are reachable;
- existing Caddy configuration is backed up and audited;
- the new Caddy fragment validates;
- TLS issuance succeeds;
- health/readiness checks pass;
- rollback is tested;
- no unrelated Caddy sites or services are changed;
- exact before/after evidence is captured.

This authorization does not allow Codex to invent missing DNS records, credentials, Odoo models, n8n workflow IDs or production secrets. If any required external value is absent, stop with a precise blocker instead of bypassing it.

## 17. Deployment target

Preferred host:

```text
Codestra middleware/Caddy server
public IP: 65.109.65.169
private IP: 10.40.0.1
```

Use an isolated source checkout and release directory. Do not develop in a live web root. Audit the real host before assuming paths or service names.

Preferred runtime:

```text
Caddy :80/:443
  -> reverse_proxy 127.0.0.1:3100
  -> Nuxt/Nitro Node process
  -> same-origin server APIs
  -> authenticated Codestra middleware endpoint
```

Use the deployment and rollback rules in `docs/CADDY_PRODUCTION_DEPLOYMENT.md`.

## 18. Required final report

Provide:

1. hostname and IPs;
2. working directory;
3. repository remote;
4. branch and starting SHA for each branch;
5. final release SHA;
6. every commit and changed file;
7. implemented route count in English and Spanish;
8. route manifest and sitemap counts;
9. screenshots or browser evidence for mobile, tablet and desktop;
10. exact type-check, lint, test and build commands/results;
11. exact Playwright and accessibility results;
12. exact Lighthouse results per tested route/profile;
13. exact broken-link, metadata, sitemap and structured-data results;
14. form contract and durable middleware test evidence;
15. Odoo test-mode lead/contact mapping evidence;
16. n8n test-mode workflow evidence;
17. container, dependency and secret-scan results;
18. staging URL and smoke results;
19. production domain, TLS issuer/expiry and HTTP status evidence;
20. Caddy validation and reload result;
21. health/readiness results;
22. analytics/consent verification;
23. rollback command and rehearsal result;
24. known limitations and follow-up work;
25. confirmation that no live email delivery, production billing or unrelated service was changed.

Do not mark the mission complete merely because the build command passes.
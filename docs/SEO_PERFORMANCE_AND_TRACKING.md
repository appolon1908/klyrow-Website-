# Klyrow Website — SEO, Performance and Tracking Acceptance

## 1. Principles

The website must be genuinely useful, crawlable, fast and accessible. Passing automated checks is necessary but not sufficient. Codex must not claim guaranteed rankings, guaranteed indexing, guaranteed rich results or perfect real-world speed.

Use Nuxt 4 SSR and prerendering to provide meaningful HTML before hydration. Do not depend on client-side JavaScript for primary page content, navigation, metadata or form labels.

## 2. URL and locale policy

Canonical domain:

```text
https://klyrow.com
```

English:

```text
https://klyrow.com/<route>
```

Spanish:

```text
https://klyrow.com/es/<route>
```

Rules:

- lowercase kebab-case URLs;
- one canonical URL per page;
- no duplicate trailing-slash and non-trailing-slash variants;
- redirect `http` to `https`;
- redirect `www` to apex;
- redirect accidental duplicate locale forms;
- no session IDs or tracking parameters in canonicals;
- strip or ignore unapproved tracking parameters for canonical generation;
- use 301/308 only for permanent URL changes;
- return 404 for unknown pages rather than soft-404 content.

## 3. Metadata contract

Every indexable page requires a typed SEO record:

```text
route
locale
title
description
canonical
alternate_locales
open_graph_title
open_graph_description
open_graph_image
open_graph_type
twitter_card
robots
schema_types
last_modified
```

Quality rules:

- unique human-readable title;
- concise description that accurately summarizes visible content;
- no repetitive keyword lists;
- no claims not visible on the page;
- no auto-generated meaningless city/country pages;
- titles and headings need not be identical, but must be consistent;
- localized pages use localized metadata;
- Open Graph images have stable absolute URLs and dimensions;
- default social image plus page-specific images for top landing pages.

## 4. Hreflang

Each English/Spanish pair must output:

```text
rel=alternate hreflang=en
rel=alternate hreflang=es
rel=alternate hreflang=x-default
```

Every alternate must reference a valid 200 indexable page and must be reciprocal. Utility/noindex routes do not need hreflang unless required for user experience.

Add automated tests that compare all route pairs.

## 5. Sitemaps

Generate:

```text
/sitemap.xml                 sitemap index
/sitemaps/pages-en.xml       46 English content pages + approved English legal pages
/sitemaps/pages-es.xml       46 Spanish content pages + approved Spanish legal pages
/robots.txt
```

Rules:

- only canonical indexable 200 URLs;
- accurate `lastmod` from content metadata or release date;
- no API, utility, error, preview, staging or form-success URLs;
- no parameter variants;
- valid XML;
- absolute HTTPS URLs;
- sitemap index referenced in robots.txt;
- production domain only.

Add route count tests so the expected sitemap count cannot silently drift.

## 6. Structured data

Use JSON-LD. Only include data supported by visible page content.

### Home/about

```text
Organization
WebSite
```

Required Organization data must be configurable and may include only verified values:

```text
name
url
logo
contactPoint
sameAs
```

Do not include placeholder social URLs.

### Hierarchical pages

```text
BreadcrumbList
```

Breadcrumb links must match visible breadcrumb/navigation context.

### Platform/product pages

Use `SoftwareApplication` only when every required property is accurate and visible. Do not invent price, aggregate rating or review count. If approved pricing is absent, omit unsupported offer markup.

### FAQs

Visible FAQ content may use appropriate schema when current Google guidelines support it. Do not create FAQ markup solely for invisible content or repeated boilerplate.

### Validation

- JSON syntax test;
- schema shape test;
- no invalid URLs;
- no missing visible content;
- Rich Results Test handoff for representative deployed pages;
- record warnings and errors honestly.

## 7. Internal linking

Requirements:

- all indexable pages reachable through ordinary `<a href>` links;
- mobile and desktop navigation expose the same route set;
- breadcrumbs for hierarchical pages;
- related-feature links;
- relevant solution-to-feature and feature-to-integration links;
- footer hub links;
- no indexable orphan pages;
- no links with empty or JavaScript-only hrefs;
- no more than three clicks from home for launch pages where practical.

Run an internal-link crawler in CI and fail on broken internal links.

## 8. Content quality

Codex must not generate:

- doorway pages;
- spun or lightly modified duplicate content;
- fake comparisons;
- fake customer success stories;
- fake benchmarks;
- fake certifications;
- hidden SEO text;
- irrelevant glossary blocks;
- excessive exact-match keyword repetition;
- pages whose only purpose is search-engine capture.

Each feature page should provide concrete product explanation and distinguish current, planned and optional capabilities if the source platform state is uncertain.

## 9. Image SEO and delivery

- descriptive filenames;
- meaningful alt text for informative images;
- empty alt for decorative images;
- explicit width/height or aspect ratio;
- AVIF and WebP where supported;
- responsive `srcset`/sizes;
- lazy load below the fold;
- eagerly load/preload only the actual LCP image when justified;
- no text baked into important raster images;
- SVG sanitized and accessible;
- image sitemap only if a real benefit is demonstrated.

## 10. Performance targets

Core Web Vitals good thresholds at the 75th percentile:

```text
LCP <= 2.5 s
INP <= 200 ms
CLS <= 0.1
```

Lighthouse CI minimums on mobile emulation:

```text
Home:       Performance >= 95, Accessibility 100, Best Practices >= 95, SEO 100
Pricing:    Performance >= 95, Accessibility 100, Best Practices >= 95, SEO 100
Feature:    Performance >= 95, Accessibility 100, Best Practices >= 95, SEO 100
Solution:   Performance >= 95, Accessibility 100, Best Practices >= 95, SEO 100
```

If a score is below target, the PR must identify the failing audits and either fix them or record a reviewed exception with measured impact. Do not lower thresholds to make CI green without review.

## 11. Resource budgets

Initial route targets:

```text
Compressed JavaScript <= 180 KB
Compressed CSS <= 70 KB
Critical local fonts <= 100 KB
Above-fold image transfer <= 300 KB total
Total initial page transfer <= 900 KB on representative landing pages
Third-party JavaScript before consent = 0 KB
```

Implementation rules:

- prefer CSS/SVG diagrams over video;
- no autoplay hero video at launch;
- avoid large UI frameworks when small components suffice;
- tree-shake icons;
- lazy-hydrate or defer non-critical interactive sections where supported;
- dynamically import popup, pricing calculator and heavy code highlighting;
- use server rendering and route prerendering;
- minimize payload data;
- preconnect only to origins actually used early;
- no unused preloads;
- self-host licensed fonts where possible;
- avoid font-display layout shifts;
- reserve dimensions for media and embeds;
- no heavy scroll-jacking.

## 12. Caching

- hashed `/_nuxt/` assets: one-year immutable cache;
- versioned images/fonts: long immutable cache when filenames are content hashed;
- HTML: no immutable cache; use revalidation appropriate to deployment model;
- sitemap/robots: short controlled cache;
- API form responses: `no-store`;
- error responses: no inappropriate long cache;
- canonical redirects cached as permanent only after domain policy is final.

## 13. Real-user monitoring

Implement privacy-aware Core Web Vitals collection through a small first-party endpoint or approved analytics integration when configured.

Record:

```text
LCP
INP
CLS
TTFB
FCP
route
locale
device class
release SHA
```

Do not send user-entered form content, full IP, email, phone or identity data.

## 14. Tracking architecture

Create a typed analytics interface:

```text
trackPageView()
trackEvent()
setConsent()
setUserProperties()  // anonymous/non-sensitive only for public site
```

Providers are adapters. The site must work when no provider is configured.

Environment values:

```text
NUXT_PUBLIC_GTM_ID=
NUXT_PUBLIC_GA_MEASUREMENT_ID=
NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NUXT_PUBLIC_ANALYTICS_ENABLED=false
NUXT_PUBLIC_CONSENT_MODE_ENABLED=true
```

No provider loads until configuration and consent policy allow it.

## 15. Event data rules

Allowed examples:

```text
route
locale
cta_name
cta_location
form_type
form_step
validation_error_code
pricing_plan_key
resource_key
outbound_domain
release_sha
```

Forbidden:

```text
password
full email
full phone
message body
API key
middleware secret
Odoo key
n8n credential
private customer data
```

## 16. Consent and cookie experience

- necessary cookies separated from analytics/marketing;
- no prechecked optional consent;
- accept, reject and customize available at equivalent prominence where applicable;
- remember consent choice;
- reopen settings from footer;
- no analytics before consent when policy requires it;
- Google consent state updated before/with tag loading;
- legal text comes from approved policy content;
- automated tests verify provider scripts are absent before consent and present only after approved consent.

## 17. Google Search handoff

After production deployment:

1. verify HTTPS canonical pages;
2. confirm robots.txt is reachable;
3. confirm sitemap index and counts;
4. run URL Inspection on representative routes;
5. run Rich Results Test for home, feature and breadcrumb pages;
6. submit sitemap in Search Console using an authorized owner account;
7. record submission date and status;
8. monitor Coverage/Indexing and Core Web Vitals reports;
9. do not promise immediate indexing;
10. retain a release checklist for future page additions.

Codex may prepare these steps but cannot invent access to Search Console. Missing account authorization is a handoff item, not a reason to expose credentials.

## 18. CI checks

Required scripts or jobs:

```text
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
pnpm test:a11y
pnpm build
pnpm validate:routes
pnpm validate:links
pnpm validate:seo
pnpm validate:sitemaps
pnpm validate:structured-data
pnpm lighthouse
pnpm audit --prod
```

Use exact package scripts appropriate to the final repository. CI must publish Lighthouse reports and screenshots/traces for failed browser tests.
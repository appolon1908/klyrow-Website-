# Codex Branch Task — SEO, Structured Data and Crawl Validation

## Branch

```text
feat/seo-structured-data
```

## Status

```text
FEATURE_STATUS=SCAFFOLDED
APPLICATION_CODE_PRESENT=NO
SEO_VALIDATION=NOT_RUN
STAGING_CHANGED=NO
PRODUCTION_CHANGED=NO
```

## Prerequisites

Before implementation, recreate/update this branch from accepted:

```text
feat/content-localization-pages
feat/feature-pricing-conversion
feat/legal-privacy-cookie-center
```

## Objective

Make every approved indexable Klyrow marketing and legal route technically sound, discoverable and internally connected without inventing rankings, reviews, prices, compliance status or claims.

## Required implementation

- central typed page SEO object;
- unique localized title and meta description per approved indexable route;
- canonical URLs;
- reciprocal English/Spanish hreflang and `x-default`;
- Open Graph/social metadata;
- sitemap index and locale sitemaps generated from the marketing route manifest and approved legal registry;
- robots.txt;
- real 404 status/page;
- correct noindex for form success/error, cookie settings, privacy request/status, legal version history, draft/review/retired legal documents and other utilities;
- conditional legal routes excluded when disabled;
- Organization and WebSite JSON-LD only where accurate;
- BreadcrumbList on hierarchical routes;
- SoftwareApplication/FAQ schema only when visible content supports every property and policy permits it;
- crawlable internal links and related-content system;
- Search Console verification through environment configuration;
- metadata, canonical, hreflang, sitemap, structured-data, redirect and broken-link validators;
- image alt text based on purpose rather than keyword stuffing.

## Route-count rules

Marketing routes:

```text
46 English
46 Spanish
```

Legal routes:

- count derives from `LegalDocumentDefinition` entries with `status=approved` and `indexable=true`;
- the planned public legal set has up to 12 routes per locale;
- draft/review/retired/disabled/utility routes do not count as indexable;
- English/Spanish approval parity is required for paired published routes unless explicitly approved otherwise.

Do not hard-code a misleading total when legal approvals are still pending. Report:

```text
MARKETING_INDEXABLE_EN=
MARKETING_INDEXABLE_ES=
LEGAL_INDEXABLE_EN=
LEGAL_INDEXABLE_ES=
TOTAL_INDEXABLE=
NOINDEX_UTILITY_COUNT=
DISABLED_CONDITIONAL_COUNT=
```

## Legal indexing rules

- only approved effective legal documents may be indexable;
- draft/review pages display noindex in review environments;
- retired/historical versions are noindex unless counsel explicitly approves indexing;
- `/cookie-settings`, `/privacy-request`, `/privacy-request/status/*`, `/do-not-sell-or-share` intake, and `/legal/version-history` are normally noindex;
- legal pages must not use FAQ schema solely for search enhancement;
- legal effective/updated dates must match the registry;
- sitemap generation fails closed on missing canonical, locale pair, version or publication state.

## Content restrictions

- no fake reviews, ratings, prices, customers, awards, certifications or statistics;
- no hidden text, doorway pages, duplicated thin content or keyword stuffing;
- no guaranteed ranking, indexing, rich-result or inbox-placement claims;
- no draft legal text presented as effective/indexable;
- no indexable success/error/privacy-token routes.

## Required tests

- exact 46 marketing route count per locale;
- legal count equals approved/indexable registry entries;
- every canonical is self-consistent and absolute;
- every localized published pair has reciprocal hreflang;
- `x-default` behavior;
- no duplicate title/description/H1 across materially different routes unless reviewed;
- sitemap count/status and locale partition;
- draft/retired/utility exclusion;
- conditional route exclusion;
- robots rules;
- real 404 status;
- JSON-LD parses and matches visible content;
- all internal links resolve;
- no orphan approved indexable page;
- redirect loop detection;
- production build/prerender validation.

## Git delivery

Push only this branch, update draft PR #11 and post exact route/sitemap/link/metadata/legal-indexing evidence. Stop before analytics/performance/deployment.

## Prohibited

- no analytics loader;
- no invented SEO/legal proof;
- no form/API/middleware scope expansion;
- no Docker/Caddy/staging/production deployment;
- no claim that Google indexing/ranking is guaranteed or live.
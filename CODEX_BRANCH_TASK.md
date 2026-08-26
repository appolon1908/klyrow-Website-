# Codex Branch Task — SEO, Structured Data and Crawl Validation

## Branch

```text
feat/seo-structured-data
```

## Prerequisites

Update from accepted localized-content and conversion branches before implementation.

## Objective

Make every indexable Klyrow route technically sound, discoverable and internally connected without inventing rankings, reviews, prices or claims.

## Required implementation

- Central typed page SEO object.
- Unique localized title and meta description per indexable route.
- Canonical URLs.
- Reciprocal English/Spanish hreflang and `x-default`.
- Open Graph/social metadata.
- Sitemap index and locale sitemaps.
- robots.txt.
- Real 404 status and page.
- Correct noindex behavior for form success/error and other utility routes.
- Organization and WebSite JSON-LD where accurate.
- BreadcrumbList on hierarchical routes.
- SoftwareApplication or FAQ schema only when visible content supports every property and policy permits it.
- Crawlable internal links and related-content system.
- Search Console verification through environment configuration.
- Metadata, canonical, hreflang, sitemap, structured-data and broken-link validators.
- Status-code and redirect tests.
- Image alt text based on purpose rather than keyword stuffing.

## Content restrictions

- No fake reviews, ratings, prices, customers, awards or statistics.
- No hidden text, doorway pages, duplicated thin content or keyword stuffing.
- No guaranteed ranking, indexing, rich results or inbox placement claims.
- Do not index utility/success/error routes.

## Required tests

- Exact indexable URL counts by locale.
- Every canonical is self-consistent and absolute.
- Every localized pair has reciprocal hreflang.
- `x-default` behavior.
- No duplicate title/description/H1 across materially different routes unless explicitly reviewed.
- Sitemap URL count and status.
- robots rules.
- 404 status.
- Noindex utility routes.
- JSON-LD parses and matches visible content.
- All internal links resolve.
- No orphan indexable page.
- Redirect loop detection.
- Production build/prerender validation.

## Git delivery

Push only this branch, open/update one draft PR and post exact route/sitemap/link/metadata evidence. Stop before analytics/performance/deployment.

## Prohibited

- No analytics loader.
- No invented SEO proof.
- No form/API/middleware scope expansion.
- No Docker/Caddy/production deployment.

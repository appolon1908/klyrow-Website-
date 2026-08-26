# Codex Branch Mission — SEO, Performance and Tracking

Branch: `feat/website-seo-performance`

Before implementation, update/recreate this branch from the reviewed frontend and forms baselines. Read `docs/SEO_PERFORMANCE_AND_TRACKING.md` completely.

Required:

- typed SEO metadata for every localized page;
- canonical, reciprocal hreflang and `x-default`;
- sitemap index, locale sitemaps and robots.txt;
- accurate Organization, WebSite, BreadcrumbList and supported page JSON-LD;
- meaningful SSR/prerendered HTML;
- image/font optimization and budgets;
- link, metadata, sitemap and structured-data validation;
- consent-aware optional GTM/GA4 adapter;
- non-sensitive event taxonomy;
- privacy-safe Core Web Vitals collection;
- Lighthouse CI and mobile/desktop reports;
- Search Console/Rich Results handoff.

Targets: LCP <=2.5s, INP <=200ms, CLS <=0.1; representative Lighthouse mobile Performance >=95, Accessibility 100, Best Practices >=95, SEO 100.

Do not promise rankings/indexing, stuff keywords, build doorway/thin pages, fabricate reviews/ratings/customers/prices/certifications, load optional analytics before required consent or deploy production.

Push only this branch, open/update one draft PR against the latest reviewed product baseline, attach exact reports and stop.
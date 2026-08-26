# Codex Branch Task — Legal, Privacy and Cookie Center

## Branch

```text
feat/legal-privacy-cookie-center
```

## Status

```text
FEATURE_STATUS=SCAFFOLDED
APPLICATION_CODE_PRESENT=NO
LEGAL_TEXT_APPROVED=NO
STAGING_CHANGED=NO
PRODUCTION_CHANGED=NO
```

## Prerequisites

Before implementation, recreate or update this branch from accepted:

```text
refactor/modular-website-architecture
feat/site-shell-design-system
feat/content-localization-pages
feat/public-api-bff
```

Read completely:

1. `docs/IMPLEMENTATION_STATUS_AND_RELEASE_TRUTH.md`
2. `docs/LEGAL_PRIVACY_COOKIE_COMPLIANCE.md`
3. `docs/REPOSITORY_ARCHITECTURE_AND_API_CATALOG.md`
4. `docs/API_FORM_CTA_CONTRACT.md`
5. `docs/BRANCH_AND_DELIVERY_PLAN.md`
6. sitemap, form, SEO, analytics, security, Docker, Caddy, and release contracts.

## Objective

Build a complete bilingual legal, privacy, cookie, consent, and public privacy-request center. Use draft legal content and configurable factual fields until counsel-approved text is supplied.

This branch owns legal-document publication, cookie/storage registry, cookie preferences, privacy/DPA/abuse/security public flows, and consent gating foundations. It does not enable GTM/GA4 or production tracking.

## Required legal pages

Complete English and Spanish routes:

```text
/legal
/privacy
/terms
/acceptable-use
/cookies
/anti-spam
/data-processing-addendum
/subprocessors
/security-disclosure
/accessibility
/service-support-policy
/copyright-trademark
```

Noindex utility routes:

```text
/cookie-settings
/privacy-request
/privacy-request/status/:publicToken
/do-not-sell-or-share
/legal/version-history
```

Implement conditional templates, disabled unless applicable and approved:

```text
/refund-cancellation
/service-level-agreement
/children-privacy
/biometric-privacy
/ai-transparency
/community-guidelines
/modern-slavery-statement
/tax-information
```

## Legal registry

Implement the typed legal registry from `docs/LEGAL_PRIVACY_COOKIE_COMPLIANCE.md`.

Required behavior:

- `draft`, `review`, `approved`, and `retired` states;
- version, effective date, last updated, owner, canonical, indexing, acceptance, and related-document metadata;
- only approved documents are effective/indexable in production;
- English/Spanish version parity;
- legal hub/footer generated from registry;
- missing approved translation blocks release;
- prior-version evidence;
- print styles and generated table of contents;
- no statement implying counsel approval when none exists.

## Legal content

Create high-quality draft content with visible `Draft — legal review required` state in non-production review environments.

Use configuration placeholders for:

- legal entity name;
- registered address;
- privacy, legal, security, abuse, accessibility, and support contact channels;
- governing law/venue;
- approved service/support commitments;
- actual subprocessors;
- approved commercial/refund terms.

Fail closed or hide affected production sections when required values/approval are absent. Do not invent an entity, physical address, certification, SLA, refund rule, vendor, or legal conclusion.

## Cookie/storage registry

Implement one typed registry for every:

```text
cookie
localStorage key
sessionStorage key
IndexedDB use
pixel
external script
embedded third-party service
```

Categories:

```text
necessary
preferences
analytics
marketing
```

CI must fail when runtime code introduces an unregistered storage/third-party technology.

The cookie policy and preference center must derive inventory fields from the registry.

## Consent experience

Implement:

```text
Accept all
Reject non-essential
Customize
Save preferences
Withdraw/change preferences
```

Requirements:

- non-essential categories off by default in strict mode;
- no preselected non-essential category;
- reject choice is not hidden behind extra screens;
- equal, accessible interaction quality;
- keyboard complete and screen-reader tested;
- 320px and 200% zoom support;
- reduced-motion support;
- single consent/script gate;
- immediate category activation/deactivation where technically possible;
- GPC/opt-out preference handling through configuration;
- footer `Cookie settings` action always available;
- no marketing/analytics SDK loaded by this branch.

## Required APIs

Implement or complete the BFF handlers using shared contracts and mocked durable adapters:

```text
GET  /api/v1/public/legal-documents
GET  /api/v1/public/legal-documents/:slug
GET  /api/v1/consent/cookies/config
GET  /api/v1/consent/cookies/current
PUT  /api/v1/consent/cookies
POST /api/v1/consent/cookies/reset
POST /api/v1/privacy/requests
GET  /api/v1/privacy/requests/:publicToken
POST /api/v1/privacy/opt-out
POST /api/v1/leads/dpa-request
POST /api/v1/subscriptions/subprocessor-updates
POST /api/v1/subscriptions/legal-updates
POST /api/v1/abuse/report
POST /api/v1/security/report
```

All writes require:

- typed server validation;
- request ID;
- idempotency when externally visible;
- CSRF/origin protection;
- body and rate limits;
- stable problem responses;
- privacy-safe logging;
- no false success without durable mocked acceptance;
- no direct Odoo/n8n/database access.

## Privacy request flow

Support:

```text
ACCESS
CORRECTION
DELETION
PORTABILITY
OBJECTION
RESTRICT_PROCESSING
OPT_OUT_SALE_OR_SHARING
LIMIT_SENSITIVE_USE
AUTHORIZED_AGENT
OTHER
```

Requirements:

- collect only the minimum intake information;
- account creation is not required by default;
- verification happens later in the approved privacy workflow;
- public status token is random, scoped, expiring, and rate limited;
- safe status only; no full personal data;
- no direct deletion from any external system;
- accessible success, verification-needed, in-progress, completed, denied, and expired states.

## Form consent

Provide reusable concise notices for all website forms.

Separate:

```text
service_contact
marketing_consent
terms_acceptance when required
```

No prechecked marketing boxes and no automatic marketing subscription from a service request.

## SEO/indexing

- approved public documents can be indexable;
- draft/review documents are noindex;
- utility and request/status pages are noindex;
- conditional disabled pages return intentional 404/approved redirect;
- canonical/hreflang generated from registry;
- sitemaps include only approved indexable documents;
- no legal FAQ schema solely for SEO.

## Accessibility

Test:

- semantic headings and table of contents;
- keyboard banner/settings/dialogs;
- focus trap/restore;
- live status;
- readable line lengths;
- contrast;
- mobile/touch targets;
- 200% zoom;
- print view;
- language attributes;
- accessible tables/download alternatives;
- English and Spanish completeness.

## Security/privacy

- no privacy-request payload in analytics;
- no full free-text request/report bodies in general logs;
- no sequential public status IDs;
- no sensitive query parameters;
- no CAPTCHA token logging;
- no arbitrary URL fetching;
- safe legal-content rendering;
- file uploads disabled unless separately reviewed and hardened;
- security/abuse forms warn against sending credentials.

## Required tests

### Registry and content

- all required routes in both locales;
- registry metadata/version validation;
- draft/approved/retired behavior;
- translation parity;
- related links;
- footer/legal hub generation;
- no unresolved placeholders in approved mode.

### Consent

- default strict behavior;
- accept/reject/customize;
- change/withdraw/reset;
- persistence and version migration;
- GPC configured behavior;
- no non-essential script/network request before permission;
- registry/runtime inventory consistency;
- accessibility/device tests.

### APIs and flows

- validation/minimization;
- idempotency duplicate/conflict;
- CSRF/origin/rate/body limits;
- safe problem responses;
- durable accepted/rejected/unavailable fixtures;
- public token isolation/expiry/rate limits;
- privacy-safe logs;
- no direct external calls.

### SEO/release

- canonical/hreflang;
- sitemap inclusion/exclusion;
- noindex utilities;
- disabled conditional 404;
- effective/updated dates;
- print and link tests.

## Counsel gate

Do not mark legal documents production-effective without recorded approval metadata. Report every document as:

```text
DRAFT
IN_REVIEW
APPROVED
BLOCKED_MISSING_FACTS
BLOCKED_MISSING_COUNSEL
```

## Completion report

Include:

1. branch starting/final SHAs, commits, changed files;
2. route count by locale and indexing status;
3. legal registry inventory;
4. cookie/storage registry inventory;
5. APIs implemented and contract evidence;
6. consent and GPC test results;
7. browser/accessibility results;
8. security/privacy tests;
9. SEO/sitemap/noindex results;
10. mocked middleware/Odoo/n8n event evidence;
11. document approval status table;
12. exact type/lint/test/build results;
13. blockers and missing legal facts;
14. confirmation that GTM/GA4, production tracking, staging, and production were not activated.

## Prohibited

- no production publication;
- no false legal approval/compliance claim;
- no invented entity/address/vendor/SLA/refund term;
- no analytics or marketing technology before consent;
- no direct Odoo/n8n/database access;
- no external-system deletion;
- no Docker/Caddy deployment;
- no secret or credential.

After pushing implementation and exact evidence to the draft PR, stop before `feat/forms-conversion-engine`.
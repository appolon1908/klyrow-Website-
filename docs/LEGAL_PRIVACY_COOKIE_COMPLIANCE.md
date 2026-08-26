# Klyrow Website — Legal, Privacy and Cookie Compliance Center

## 1. Purpose and limitation

This document defines the product, content, API, data, testing, and release requirements for Klyrow's public legal and privacy center.

It is an implementation contract, not legal advice. All substantive legal text must be reviewed and approved by qualified counsel for the operating entity, jurisdictions, actual data practices, vendors, pricing model, and product capabilities before production publication.

Do not publish generic templates as if they were counsel-approved. Do not claim compliance, certification, registration, or contractual commitments that have not been verified.

## 2. Legal-document registry

Every document is represented by a typed registry entry:

```ts
interface LegalDocumentDefinition {
  id: string
  slug: string
  locale: 'en' | 'es'
  title: string
  summary: string
  version: string
  status: 'draft' | 'review' | 'approved' | 'retired'
  effectiveDate?: string
  lastUpdated: string
  owner: 'legal' | 'privacy' | 'security' | 'support' | 'finance'
  canonicalPath: string
  indexable: boolean
  requiresAcceptance: boolean
  supersedesVersion?: string
  relatedDocuments: string[]
  contactRoute?: string
  featureFlag?: string
}
```

Rules:

- only `approved` documents may be presented as effective production terms;
- draft/review documents are noindex outside protected review environments;
- retired versions remain available to authorized administrators and release evidence;
- every published document has an effective date, last-updated date, version, and contact channel;
- English and Spanish versions share the same semantic version and approval state;
- a missing translation blocks publication unless the route is intentionally unavailable in that locale;
- the footer and legal hub are generated from the registry rather than hard-coded lists;
- legal version changes create release evidence and, where required, a user-notification workflow.

## 3. Required public legal pages per locale

### 3.1 Legal center

```text
/legal
```

Includes:

- current legal and policy documents;
- effective/last-updated dates;
- document status;
- privacy, security, abuse, accessibility, and support contact paths;
- prior-version access where approved;
- cookie-settings action;
- privacy-request action.

### 3.2 Privacy policy

```text
/privacy
```

Must accurately describe, based on actual implementation:

- responsible entity/controller or business identity;
- contact information;
- categories of personal data collected;
- sources of data;
- purposes of processing/use;
- legal bases where applicable;
- recipients and service providers;
- international transfers where applicable;
- retention approach;
- security overview without exposing controls;
- individual/consumer rights;
- how to submit a request;
- cookies and tracking reference;
- children/minors position;
- changes to the policy;
- complaint/regulator contact where counsel requires it.

Forms must link to the specific applicable notice at the point of collection.

### 3.3 Terms of service

```text
/terms
```

Potential sections, subject to counsel and the actual commercial model:

- contracting entity;
- eligibility and authority;
- account responsibilities;
- acceptable use incorporation;
- service scope;
- beta/preview functionality;
- customer content and permissions;
- fees, taxes, renewal, cancellation, and refunds when applicable;
- intellectual property;
- confidentiality;
- third-party services;
- suspension and termination;
- warranties and disclaimers;
- limitation of liability;
- indemnity;
- governing law/disputes;
- changes and notices;
- contact.

Do not publish payment, renewal, refund, SLA, warranty, or liability promises that the approved commercial model does not support.

### 3.4 Acceptable use policy

```text
/acceptable-use
```

Cover at minimum:

- unlawful activity;
- spam and unsolicited messaging;
- purchased/scraped lists and consent expectations;
- phishing, malware, impersonation, and fraud;
- harmful or abusive content;
- credential abuse;
- unauthorized security testing;
- excessive resource use;
- circumvention of policy, limits, or provider controls;
- prohibited data and regulated use cases where applicable;
- investigation, suspension, and appeal process;
- abuse reporting.

### 3.5 Cookie policy

```text
/cookies
```

Generated in part from the cookie registry and includes:

- what cookies and similar technologies are;
- first-party and third-party distinction;
- session and persistent distinction;
- categories used by Klyrow;
- purpose of each category;
- cookie/local-storage inventory;
- provider;
- duration/expiry;
- legal/consent mode where configured;
- how to accept, reject, or change preferences;
- how browser controls and GPC/opt-out signals are handled;
- contact and last updated date.

### 3.6 Anti-spam and messaging policy

```text
/anti-spam
```

Explain product expectations for:

- permission and lawful basis;
- sender identity;
- accurate routing/header information;
- honest subject and message content;
- unsubscribe and preference handling;
- suppression enforcement;
- complaints and abuse;
- list acquisition;
- reseller/customer responsibility;
- transactional versus marketing classification;
- enforcement and suspension.

The policy must align with actual Klyrow enforcement and must not promise perfect inbox placement or legal compliance for customers.

### 3.7 Data processing addendum

```text
/data-processing-addendum
```

Production behavior:

- show approved DPA terms or a clearly labeled request workflow;
- include version/effective date;
- define parties and roles only after counsel approval;
- include processing details/schedules only when accurate;
- link to subprocessors and security information;
- support signed-copy or sales/legal contact flow if required.

A generic DPA must not be presented as executed merely because a visitor viewed or downloaded it.

### 3.8 Subprocessor list

```text
/subprocessors
```

Use a structured registry:

```ts
interface SubprocessorDefinition {
  name: string
  servicePurpose: string
  dataCategories: string[]
  processingLocations: string[]
  entity?: string
  addedDate: string
  status: 'active' | 'planned' | 'retired'
  privacyUrl?: string
}
```

Requirements:

- list only actual approved vendors and Klyrow-controlled infrastructure;
- distinguish a product integration from a subprocessor relationship;
- do not expose credentials, private addresses, or internal topology;
- support optional update subscriptions;
- keep historical change evidence.

### 3.9 Security disclosure policy

```text
/security-disclosure
```

Include:

- authorized reporting channel;
- what information to include;
- warning not to send active credentials in plain text;
- safe-harbor language only if counsel approves it;
- prohibited testing boundaries;
- expected acknowledgement target only if operations can meet it;
- coordinated disclosure process;
- exclusions and emergency contact guidance.

### 3.10 Accessibility statement

```text
/accessibility
```

Include:

- accessibility commitment;
- supported standards target;
- known limitations based on actual audits;
- assistive-technology/browser testing summary;
- feedback/contact method;
- response process;
- last audit/update date.

Do not claim WCAG conformance until the measured release evidence supports it.

### 3.11 Service and support policy

```text
/service-support-policy
```

Cover only approved commitments:

- support channels;
- support hours/time zone;
- severity definitions;
- target response times, if approved;
- maintenance communication;
- incident/status communication;
- exclusions;
- escalation path;
- relation to enterprise contracts or SLAs.

### 3.12 Copyright and trademark notice

```text
/copyright-trademark
```

Include:

- ownership notice;
- permitted website use;
- trademark guidance;
- third-party marks disclaimer;
- infringement/reporting route;
- open-source attribution link where required.

## 4. Required privacy and cookie utility pages

These routes are public but normally `noindex`:

```text
/cookie-settings
/privacy-request
/privacy-request/status/:publicToken
/do-not-sell-or-share
/legal/version-history
```

### Cookie settings

Must provide the same choices available on first visit and allow withdrawal/change at any time.

### Privacy request

Supported request categories:

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

Collect only what is necessary to receive and securely verify the request. Do not require account creation for requests that should not require one. Verification policy belongs to the back-office privacy workflow, not the static page.

### Do not sell or share

This route is controlled by jurisdiction/applicability configuration. If Klyrow does not sell/share personal information as legally defined, the page should explain the current position and still provide a privacy-contact/request path rather than making an unsupported legal conclusion.

## 5. Conditional legal pages

Implement templates and registry support, but publish only when applicable and approved:

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

A disabled conditional page must return an intentional 404 or approved redirect and must not appear in sitemaps or navigation.

## 6. Cookie and storage registry

All browser storage mechanisms are registered in code:

```ts
interface StorageTechnologyDefinition {
  id: string
  namePattern: string
  provider: string
  purpose: string
  category: 'necessary' | 'preferences' | 'analytics' | 'marketing'
  mechanism: 'cookie' | 'localStorage' | 'sessionStorage' | 'indexedDB' | 'pixel' | 'script'
  firstParty: boolean
  duration: string
  domainScope: string
  secureRequired: boolean
  httpOnly?: boolean
  consentRequired: boolean
  enabledByFeature: string
}
```

Rules:

- no unregistered cookie, pixel, SDK, storage key, or third-party script may ship;
- CI compares detected use against the registry;
- necessary storage is minimized and documented;
- non-essential technology remains disabled until permitted;
- removing a technology updates both runtime and policy inventory;
- names and durations in the cookie policy come from the registry;
- secrets and authentication tokens never enter analytics or marketing storage.

## 7. Consent interface

### Initial banner

Required controls:

```text
Accept all
Reject non-essential
Customize
```

Requirements:

- no preselected non-essential categories;
- reject is not hidden behind multiple screens;
- clear category descriptions;
- no deceptive color, contrast, or wording;
- keyboard complete;
- focus managed;
- screen-reader labels and status;
- works at 320 CSS pixels and 200% zoom;
- honors reduced motion;
- no page access blocked unless a strictly necessary legal/business reason is documented.

### Preference center

Categories:

```text
Necessary        always active when technically required
Preferences      optional
Analytics        optional
Marketing        optional
```

Show active technologies under each category.

### Consent record

Persist only the minimum approved evidence:

```json
{
  "consent_id": "cns_...",
  "policy_version": "cookies-1.0.0",
  "locale": "en",
  "source": "banner",
  "necessary": true,
  "preferences": false,
  "analytics": false,
  "marketing": false,
  "gpc_detected": false,
  "recorded_at": "2026-08-26T00:00:00Z"
}
```

Use a signed first-party preference cookie or equivalent approved mechanism. Server-side audit storage, if enabled, must be purpose-limited and privacy reviewed.

## 8. Script and tag gating

Create one consent gate. Do not let each component decide independently whether to load tracking.

```text
application starts
  -> necessary functionality only
  -> load consent preference
  -> apply GPC/applicability rules
  -> user choice
  -> enable approved category adapters
  -> emit privacy-safe consent-change event
```

GTM/GA4, marketing pixels, embedded third-party media, and similar tools must be registered and category gated.

Tests must prove that non-essential network requests do not occur before permission in the strict consent test profile.

## 9. Form notices and consent

Every form shows a concise notice near submission and links to the full privacy policy.

Separate:

```text
service_contact=true/false
marketing_consent=true/false
legal_terms_acceptance=true/false when required
```

Rules:

- requesting service contact must not silently subscribe a person to marketing;
- marketing consent is optional unless the form itself is exclusively a newsletter subscription;
- policy/document version is captured;
- no bundled consent;
- no prechecked marketing box;
- consent withdrawal path is provided;
- privacy notice and consent text are localized.

## 10. Privacy request workflow

Required flow:

```text
visitor submits request
  -> website validates/minimizes
  -> durable middleware acceptance
  -> privacy request ID created
  -> Odoo/helpdesk or approved privacy case receives mirror/task
  -> n8n may notify/route but is not authoritative
  -> identity verification and fulfillment occur in approved back office
  -> status/result returns through middleware
  -> public status token shows safe status only
```

Status values:

```text
RECEIVED
AWAITING_VERIFICATION
VERIFIED
IN_REVIEW
FULFILLMENT_IN_PROGRESS
COMPLETED
PARTIALLY_COMPLETED
DENIED_WITH_REASON
WITHDRAWN
EXPIRED
```

No website code directly deletes records from Odoo, Klyrow, Postal, Keycloak, n8n, or another system.

## 11. Legal APIs

Required endpoints:

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

All writes require request IDs, idempotency where applicable, typed validation, rate limits, origin/CSRF controls, stable errors, privacy-safe logs, and durable middleware acceptance.

## 12. SEO and indexing

- approved public legal documents may be indexable;
- draft/review documents are noindex;
- cookie settings, privacy request, and status routes are noindex;
- conditional documents are excluded when disabled;
- canonical and hreflang are generated from the legal registry;
- legal pages are included in localized sitemaps only when approved and indexable;
- historical versions are normally noindex unless counsel approves indexing;
- legal pages must not contain FAQ schema solely for search enhancement.

## 13. Accessibility

Legal content must support:

- semantic headings;
- generated table of contents;
- skip links;
- readable line length;
- print styles;
- keyboard navigation;
- visible focus;
- high contrast;
- 200% zoom;
- language metadata;
- accessible tables;
- accessible download alternatives;
- no critical information only inside a PDF.

## 14. Security and privacy

- no legal-request evidence in analytics;
- no full privacy-request payload in general logs;
- status tokens are random, scoped, expiring, and rate limited;
- no sequential request IDs exposed publicly;
- no sensitive query-string values;
- CAPTCHA tokens are never logged;
- file uploads are disabled by default; if later enabled, add separate malware, type, size, storage, and retention controls;
- abuse/security forms warn against submitting credentials;
- no arbitrary URL retrieval from submitted evidence fields;
- legal documents are rendered through a safe content pipeline.

## 15. Required tests

### Registry/content

- every required document exists in English and Spanish;
- version/effective/update metadata is valid;
- only approved documents are indexable in production;
- conditional documents are absent when disabled;
- related-document links resolve;
- footer/legal hub match registry;
- no lorem ipsum or unresolved placeholders ship.

### Cookies/consent

- initial default blocks non-essential categories;
- accept all;
- reject non-essential;
- granular save;
- change and withdraw;
- preference persistence;
- GPC behavior under configured mode;
- no non-essential script/network request before permission;
- cookie inventory matches registry;
- keyboard, screen reader, zoom, and mobile behavior.

### Privacy/legal forms

- validation and minimization;
- consent separation;
- idempotent submission;
- rate limits;
- durable middleware acceptance;
- safe status token;
- cross-token access denial;
- no false success;
- privacy-safe logs and analytics exclusion;
- Odoo/n8n contract fixtures.

### SEO/release

- canonical/hreflang;
- sitemap inclusion/exclusion;
- noindex utility routes;
- real 404 for disabled routes;
- effective and last-updated dates rendered;
- print styles;
- link validation.

## 16. Counsel approval gate

Before production, the owner must record for each legal document:

```text
DOCUMENT_ID=
VERSION=
ENTITY_NAME=
COUNSEL_REVIEW=APPROVED|NOT_REQUIRED_WITH_REASON|PENDING
APPROVER=
APPROVED_AT=
EFFECTIVE_AT=
SOURCE_HASH=
```

`PENDING` blocks publication as an effective legal document.

## 17. Definition of done

The legal/privacy/cookie branch is complete only when:

- the legal registry and bilingual document system exist;
- all required routes render;
- draft versus approved behavior is enforced;
- cookie/storage registry exists;
- consent banner and settings are complete;
- non-essential script gating is tested;
- privacy, DPA, abuse, security, and update forms are wired to mocked durable APIs;
- API contracts and tests exist;
- SEO/indexing rules pass;
- accessibility passes;
- no document is falsely represented as counsel-approved;
- production remains unchanged.
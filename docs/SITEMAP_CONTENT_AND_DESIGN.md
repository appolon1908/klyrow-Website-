# Klyrow Website — Sitemap, Content and Design Contract

## 1. Route count

The launch contains **46 unique indexable content pages per locale**.

Locales:

```text
English: canonical root routes
Spanish: /es equivalents
```

Total localized indexable marketing URLs:

```text
46 English + 46 Spanish = 92
```

Additional routes:

- four legal/policy pages per locale;
- noindex utility and confirmation routes;
- real 404 and 500 handling;
- XML sitemap and robots endpoints;
- server API routes, never indexable.

Every Spanish page must be a complete human-readable translation, not mixed-language placeholders or machine-translation fragments.

## 2. Indexable route inventory

### Core company and conversion — 8 pages

1. `/`
   - Main positioning: governed customer communications.
   - Hero CTA: `Start building` and `Request a demo`.
   - Product overview, trust architecture, features, integrations and final CTA.

2. `/platform`
   - Full platform overview.
   - Explain identity, delivery, policy, automation, analytics and back office.

3. `/pricing`
   - Configuration-driven plans.
   - Starter, Growth, Scale and Enterprise presentation.
   - Default production mode: `Contact sales` until approved prices are configured.
   - Message-volume selector and feature comparison without calculating unapproved prices.

4. `/contact`
   - General contact form.
   - Sales, support, partnership and privacy paths.

5. `/demo`
   - Demo-request page with qualification fields.
   - Product areas of interest and expected message volume.

6. `/about`
   - Klyrow mission, operating principles and platform architecture.
   - No invented team biographies, funding, offices or customer counts.

7. `/security`
   - Identity, tenant isolation, encryption, audit, delivery gates and incident process.
   - Do not claim certifications that have not been earned.

8. `/compliance`
   - Consent, preference, suppression, data-request and audit features.
   - Clearly distinguish product controls from legal advice or certification.

### Five primary audience landing pages — 5 pages

9. `/solutions/developers`
   - Email API, SMTP, webhooks, idempotency, sandbox and observability.
   - CTA: API access/signup interest.

10. `/solutions/marketing-teams`
   - Profiles, segments, content, journeys, experiments, analytics and consent.
   - CTA: request marketing demo.

11. `/solutions/agencies-resellers`
   - Multi-customer management, white-labeling, price books, margin and delegated access.
   - CTA: partner application.

12. `/solutions/enterprise`
   - SSO readiness, governance, approvals, audit, private infrastructure and support operations.
   - CTA: enterprise consultation.

13. `/solutions/odoo-automation`
   - Keycloak identity, Klyrow product state, middleware, n8n and Odoo control plane.
   - CTA: integration consultation.

### Feature pages — 21 pages

14. `/features/transactional-email`
15. `/features/marketing-email`
16. `/features/email-api`
17. `/features/smtp-relay`
18. `/features/inbound-email`
19. `/features/templates`
20. `/features/automation`
21. `/features/segmentation`
22. `/features/customer-data`
23. `/features/analytics`
24. `/features/deliverability`
25. `/features/domains`
26. `/features/webhooks`
27. `/features/api-keys`
28. `/features/consent`
29. `/features/decision-ledger`
30. `/features/simulation`
31. `/features/recipient-trust`
32. `/features/reconciliation`
33. `/features/reseller-white-label`
34. `/features/ai-assist`

Every feature page must include:

- unique title and summary;
- one clear problem statement;
- three to six concrete capabilities;
- product diagram or interface illustration;
- `How it works` section;
- security/governance note;
- integration note where relevant;
- FAQ with visible answers when useful;
- related features;
- contextual CTA;
- unique metadata and internal links;
- no copy-pasted generic paragraphs;
- no unsupported performance, deliverability, revenue or compliance claims.

### Integration pages — 6 pages

35. `/integrations`
   - Integration directory and architecture.

36. `/integrations/odoo`
   - Website lead/contact -> middleware -> Odoo CRM/contact/activity flow.
   - Odoo remains back-office; website does not access its database.

37. `/integrations/n8n`
   - Non-authoritative automation, notifications, routing and follow-up.

38. `/integrations/keycloak`
   - Authentication, verified identity, MFA and identity-provider brokering.

39. `/integrations/postal`
   - Postal 3.3.7 as primary delivery engine behind Klyrow controls.

40. `/integrations/codestra-middleware`
   - Durable integration boundary, idempotency, events, commands and reconciliation.

### Developer and resource pages — 6 pages

41. `/developers`
   - Developer platform overview and quick-start flow.

42. `/developers/api`
   - Public API concepts, authentication model, idempotency and example request shape.
   - Do not publish production secrets or undocumented private endpoints.

43. `/developers/smtp`
   - SMTP credential lifecycle, streams and secure configuration guidance.

44. `/developers/webhooks`
   - Signing, replay protection, retries and event lifecycle.

45. `/resources`
   - Resource hub for guides, implementation patterns and operational education.

46. `/resources/guides`
   - Guide index with at least six substantial launch guides represented as cards or sections.
   - Do not create thin placeholder article URLs solely for SEO.

## 3. Legal and policy pages

Per locale:

```text
/privacy
/terms
/acceptable-use
/cookies
```

These pages must:

- use clearly marked draft legal text unless counsel-approved content is supplied;
- include last-updated dates;
- include contact channels;
- avoid claiming legal review that did not occur;
- expose cookie settings where relevant.

## 4. Noindex utility routes

```text
/thank-you/demo
/thank-you/contact
/thank-you/pricing
/thank-you/partner
/thank-you/newsletter
/error
```

Rules:

- `noindex, nofollow` where appropriate;
- no sensitive data in query strings;
- submission ID may be displayed in shortened privacy-safe form;
- success pages verify server state or use trusted navigation state rather than accepting arbitrary query flags;
- forms must also support inline success without requiring a redirect.

## 5. Navigation architecture

### Product mega menu

Groups:

- Send: transactional email, marketing email, API, SMTP, inbound;
- Build: templates, automation, segmentation, customer data;
- Operate: analytics, deliverability, domains, webhooks;
- Govern: consent, decision ledger, simulation, recipient trust, reconciliation;
- Grow: reseller/white-label and AI assistance.

### Solutions menu

- Developers;
- Marketing teams;
- Agencies and resellers;
- Enterprise;
- Odoo and automation.

### Footer

Columns:

- Product;
- Solutions;
- Integrations;
- Developers;
- Resources;
- Company;
- Legal.

Include language selector, status link placeholder configured by environment, social links only when real URLs are supplied, and copyright.

## 6. Reusable page templates

Implement data-driven templates:

```text
HomePage
PlatformPage
AudienceLandingPage
FeaturePage
IntegrationPage
DeveloperPage
ResourceHubPage
PricingPage
FormPage
LegalPage
```

Content data should live in typed locale-aware modules or content files. Each route imports validated content rather than duplicating whole page implementations.

## 7. Reusable components

Required:

```text
SiteHeader
DesktopMegaMenu
MobileNavigation
LanguageSwitcher
SiteFooter
HeroSection
EditorialStatement
LogoCloudPlaceholder (disabled until approved logos exist)
FeatureGrid
BentoGrid
ArchitectureDiagram
ProductWindow
CodeExample
MetricCard (only for real or clearly labeled illustrative data)
ComparisonTable
PricingCards
FAQAccordion
TestimonialBlock (disabled until approved testimonials exist)
CTASection
LeadForm
NewsletterForm
ConsentNotice
PopupDialog
CookiePreferences
Breadcrumbs
RelatedPages
StatusBadge
InlineAlert
ToastRegion
Skeleton
ErrorBoundary
```

Do not ship fake customer logos or testimonials. Components may exist but must remain disabled until approved content is supplied.

## 8. Visual system

### Color tokens

Define semantic tokens rather than hard-coded colors in components:

```text
--surface-primary
--surface-secondary
--surface-inverse
--text-primary
--text-secondary
--text-inverse
--border-subtle
--brand-primary
--brand-secondary
--accent-coral
--accent-cyan
--accent-lime
--accent-amber
--success
--warning
--danger
--focus
```

All combinations must meet WCAG 2.2 AA contrast.

### Typography

- use a high-quality open-source or system font with proper license;
- never commit proprietary font files without a valid license;
- use fluid `clamp()` scales;
- large home hero heading may reach 72–96 CSS pixels on wide screens but must wrap gracefully;
- body text should remain approximately 17–20 CSS pixels in editorial sections;
- line lengths generally 45–75 characters;
- no text rendered as images.

### Layout

Breakpoints are content-driven, not device-brand driven. Test at minimum:

```text
360x800
390x844
768x1024
1024x768
1366x768
1440x900
1920x1080
```

Use:

- 12-column desktop grid;
- 8-column tablet grid;
- 4-column mobile grid;
- responsive containers with generous outer gutters;
- consistent vertical rhythm;
- no horizontal scroll at 320 CSS pixels.

## 9. Five distinct landing-page personalities

All use the same design system but different storytelling.

### Developers

- dark code-led hero;
- API request animation using text/SVG;
- code tabs for curl, TypeScript, Python and PHP;
- architecture and reliability emphasis.

### Marketing teams

- colorful customer-journey map;
- segment, template and analytics storytelling;
- strong consent and governance section.

### Agencies and resellers

- multi-brand portal illustration;
- customer hierarchy and margin flow;
- partnership form.

### Enterprise

- calm, high-trust dark/neutral presentation;
- identity, audit, approvals and private infrastructure;
- security consultation CTA.

### Odoo and automation

- animated but reduced-motion-safe system diagram:
  `Website -> Klyrow -> middleware -> n8n/Odoo`;
- Customer 360 and lead-routing examples;
- integration consultation CTA.

## 10. Content standards

Every page must:

- answer a real user question;
- be useful without requiring JavaScript after SSR;
- avoid exaggerated superlatives and false scarcity;
- use clear headings and scannable sections;
- define technical terms;
- distinguish implemented, planned and optional capabilities where needed;
- avoid presenting roadmap items as currently live unless verified;
- use natural relevant phrases rather than repetitive keyword lists;
- include internal links based on genuine relationships;
- contain no lorem ipsum at release.

## 11. Approved keyword themes

Use naturally where relevant:

```text
email delivery platform
transactional email API
SMTP relay service
marketing email automation
email deliverability monitoring
email webhook platform
inbound email processing
Odoo CRM email integration
n8n email automation
Keycloak SSO email platform
Postal email server platform
multi-tenant email SaaS
email compliance and consent management
white-label email platform
email API for developers
```

Spanish equivalents should be written naturally for Spanish-speaking users. Do not force every keyword onto every page.

## 12. Calls to action

Primary CTA labels:

```text
Start building
Request a demo
Talk to sales
Explore the API
Apply as a partner
See pricing
```

Spanish labels must be complete and idiomatic.

CTA destinations must be consistent and trackable. No button may be visually interactive without a valid action or route.
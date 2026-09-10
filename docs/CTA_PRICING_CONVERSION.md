# Klyrow CTA, pricing, and conversion authority

Status: source candidate  
Live form submission: **disabled**  
Analytics or advertising activation: **disabled**

## Authority

The public website owns presentation and safe navigation only. It does not own
Klyrow account sessions, provider delivery, billing ledgers, customer data,
Postal, Mautic, Odoo, or n8n state.

`apps/web/app/data/cta-registry.ts` is the typed authority for reusable calls
to action. Each entry defines:

- a stable ID and bilingual label;
- route, form, authentication, download, or external behavior;
- visual variant and future analytics event name;
- an optional local fallback;
- an explicit allowlist for any runtime-provided HTTPS host.

Runtime URLs are accepted only when they use HTTPS, contain no embedded
credentials, and match the entry's allowed host list. Unsafe or absent external
configuration falls back to an approved local information route or renders no
CTA when a fallback would be an inert self-link.

## Form handoff

This change does not implement a form submission API. Form CTAs use the
allowlisted `https://codestra.co/contact` handoff and include only:

- the registered form ID;
- `en` or `es` locale;
- the current localized route path.

No field value, token, cookie, email address, tenant identifier, or browser
storage value is transmitted by the CTA resolver.

## Pricing truthfulness

The four public plan cards describe capability scope only. They contain no
price, discount, customer count, deliverability claim, production status, or
availability guarantee. The default runtime mode is `contact_sales`.

A future `configured` presentation may describe approved non-binding ranges,
but numeric public pricing requires a separate reviewed commercial authority,
customer terms, billing contract, and release approval.

## Optional surfaces

- announcement content is blank by default;
- the engagement dialog is disabled by default;
- documentation, status, and scheduling URLs are blank by default;
- the optional dialog stores only a session-scoped dismissal flag and no
  authentication or analytics data;
- legal and privacy routes are excluded from the optional dialog.

## Required validation

Before merge, exact-head checks must prove:

- all registry targets and fallback routes are valid;
- external URLs fail closed outside their allowlists;
- English and Spanish paths remain locale-safe;
- form CTAs cannot become current-page self-links;
- pricing contains no invented public amount;
- optional engagement and announcement features remain disabled by default;
- lint, type checking, unit tests, production build, browser tests, dependency
  boundaries, secret scanning, and Horizon design contracts pass.

Source merge authorizes no live form, provider call, email delivery, account
flow, analytics provider, billing action, server deployment, DNS change, or
production traffic change.

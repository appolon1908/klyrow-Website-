# Codex Branch Task — Core Web Vitals and Accessibility Certification

## Branch

```text
perf/core-web-vitals-accessibility
```

## Prerequisites

Update from all accepted user-facing website branches before implementation.

## Objective

Measure and remediate performance and accessibility as a dedicated engineering effort. Do not hide regressions inside a broad SEO or deployment PR.

## Performance targets

```text
LCP <= 2.5 seconds
INP <= 200 milliseconds
CLS <= 0.1
```

Lighthouse CI mobile minimums on home, pricing, one solution and one feature route:

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
No optional third-party analytics before consent
```

## Required implementation

- Bundle and route analysis.
- Remove unused dependencies and code.
- Route/component lazy loading.
- Lazy load interactive tools.
- Responsive AVIF/WebP images with intrinsic dimensions.
- Above-fold image preload only when measured.
- Local/subset font strategy with no more than two families and four initial files.
- Hydration reduction and server-rendered static content.
- Avoid heavy carousel/animation libraries.
- Prevent layout shifts from images, fonts, menus, popups and forms.
- Optimize API/form interaction latency.
- Core Web Vitals instrumentation with privacy-safe aggregation hooks.
- Reduced-motion enforcement.
- WCAG 2.2 AA remediation across all representative templates and forms.
- 320px to wide-desktop responsive verification.
- 200% zoom verification.
- Touch-target and focus visibility checks.

## Device/browser matrix

At minimum:

```text
mobile Chromium
mobile WebKit
small tablet
large tablet
laptop Chromium
wide desktop Chromium
```

Add Firefox where CI capacity permits.

## Required accessibility coverage

- Skip link.
- Heading order.
- Landmarks.
- Labels/descriptions.
- Error summaries/live regions.
- Menu/drawer/dialog/tab/accordion semantics.
- Focus order, trap and restoration.
- Keyboard-only flows.
- Color contrast.
- Reduced motion.
- Content not dependent on hover.
- 200% zoom and reflow.
- Language metadata.
- Mobile touch targets.

## Required tests/evidence

- Exact bundle sizes by representative route.
- Lighthouse CI reports.
- Playwright matrix results.
- axe results with zero serious/critical violations.
- Keyboard assertions for navigation, popup, tools and all forms.
- Web Vitals measurements or lab proxies with limitations documented.
- Image/font audit.
- No unbounded long tasks or obvious hydration errors.
- Type check, lint, tests and production build.

If a target cannot be met, document the exact measurement, cause, attempted fixes and reviewed exception. Never fabricate a score.

## Git delivery

Push only this branch, open/update one draft PR and attach reports/screenshots/artifacts. Stop before Docker/Caddy/deployment.

## Prohibited

- No feature expansion unrelated to measured remediation.
- No hiding failures or disabling audits.
- No production deployment.

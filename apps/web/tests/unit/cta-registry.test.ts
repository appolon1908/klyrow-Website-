import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { englishPages } from '../../content'
import {
  ctaRegistry,
  formRouteMap,
  resolveRegisteredCta,
  type CtaId
} from '../../app/data/cta-registry'
import { pricingPlans, useCases } from '../../app/data/pricing'

const routes = new Set(englishPages.map((page) => page.path))
const ids = Object.keys(ctaRegistry) as CtaId[]
const runtime = {
  applicationLoginUrl: 'https://app.klyrow.com/auth/login',
  applicationSignupUrl: 'https://app.klyrow.com/auth/signup',
  contactUrl: 'https://codestra.co/contact',
  docsUrl: 'https://docs.klyrow.com/',
  schedulingUrl: 'https://cal.com/codestra/klyrow',
  statusUrl: 'https://status.klyrow.com/'
}

describe('CTA and pricing authority', () => {
  it('contains no empty, fragment-only, or script targets', () => {
    const targets = Object.values(ctaRegistry).map(
      ({ definition }) => definition.target
    )
    expect(targets.every((target) => target.length > 0)).toBe(true)
    expect(targets.some((target) => target === '#')).toBe(false)
    expect(targets.some((target) => target.startsWith('javascript:'))).toBe(false)
  })

  it('resolves every route, form destination, and fallback against the catalog', () => {
    const definitions = Object.values(ctaRegistry)
    const routeTargets = definitions
      .filter(({ definition }) => definition.kind === 'route')
      .map(({ definition }) => definition.target)
    const formTargets = definitions
      .filter(({ definition }) => definition.kind === 'form')
      .map(({ definition }) => formRouteMap[definition.target] ?? '')
    const fallbacks = definitions
      .map(({ fallbackRoute }) => fallbackRoute)
      .filter((route): route is string => Boolean(route))

    expect(routeTargets.every((route) => routes.has(route))).toBe(true)
    expect(formTargets.every((route) => routes.has(route))).toBe(true)
    expect(fallbacks.every((route) => routes.has(route))).toBe(true)
  })

  it('has complete bilingual labels and explicit external host policy', () => {
    const definitions = Object.values(ctaRegistry)
    expect(
      definitions.every(
        ({ labels }) => labels.en.length > 2 && labels.es.length > 2
      )
    ).toBe(true)
    expect(
      definitions
        .filter(({ definition }) =>
          ['auth', 'download', 'external'].includes(definition.kind)
        )
        .every(({ definition }) => (definition.allowedHosts?.length ?? 0) > 0)
    ).toBe(true)
  })

  it('localizes route CTAs and suppresses a current-page route', () => {
    const spanish = resolveRegisteredCta('hero-start-building', {
      currentPath: '/es',
      locale: 'es',
      runtime
    })
    expect(spanish.href).toBe('/es/developers')
    expect(spanish.external).toBe(false)
    expect(spanish.disabled).toBe(false)

    const current = resolveRegisteredCta('hero-start-building', {
      currentPath: '/es/developers',
      locale: 'es',
      runtime
    })
    expect(current.href).toBeUndefined()
    expect(current.disabled).toBe(true)
  })

  it('routes forms through the allowlisted governed contact handoff', () => {
    const resolved = resolveRegisteredCta('pricing-contact-sales', {
      currentPath: '/es/pricing',
      locale: 'es',
      runtime
    })
    const target = new URL(String(resolved.href))

    expect(resolved.external).toBe(true)
    expect(resolved.disabled).toBe(false)
    expect(target.origin).toBe('https://codestra.co')
    expect(target.pathname).toBe('/contact')
    expect(target.searchParams.get('form')).toBe('contact-sales')
    expect(target.searchParams.get('locale')).toBe('es')
    expect(target.searchParams.get('source')).toBe('/es/pricing')
  })

  it('fails closed on unsafe runtime URLs and uses a local fallback only when safe', () => {
    const unsafeAuth = resolveRegisteredCta('nav-sign-in', {
      currentPath: '/',
      locale: 'en',
      runtime: { ...runtime, applicationLoginUrl: 'https://evil.example/login' }
    })
    expect(unsafeAuth.href).toBe('/developers')
    expect(unsafeAuth.external).toBe(false)

    const unsafeContact = resolveRegisteredCta('pricing-contact-sales', {
      currentPath: '/pricing',
      locale: 'en',
      runtime: { ...runtime, contactUrl: 'http://codestra.co/contact' }
    })
    expect(unsafeContact.href).toBeUndefined()
    expect(unsafeContact.disabled).toBe(true)
  })

  it('keeps pricing capability-led and free of invented public amounts', () => {
    expect(pricingPlans).toHaveLength(4)
    expect(new Set(pricingPlans.map((plan) => plan.id)).size).toBe(4)
    expect(pricingPlans.filter((plan) => plan.featured)).toHaveLength(1)
    expect(
      pricingPlans.every(
        (plan) =>
          !('price' in plan) &&
          plan.features.length >= 3 &&
          plan.name.en.length > 0 &&
          plan.name.es.length > 0
      )
    ).toBe(true)
    expect(useCases.every((item) => routes.has(item.path))).toBe(true)
  })

  it('keeps optional conversion features disabled and external endpoints bounded by default', () => {
    const config = readFileSync(
      new URL('../../nuxt.config.ts', import.meta.url),
      'utf8'
    )
    expect(config).toContain("contactUrl: 'https://codestra.co/contact'")
    expect(config).toContain("docsUrl: ''")
    expect(config).toContain("statusUrl: ''")
    expect(config).toContain("schedulingUrl: ''")
    expect(config).toContain("pricingMode: 'contact_sales'")
    expect(config).toContain('engagementPopupEnabled: false')
    expect(config).toContain("announcement: ''")
  })

  it('uses dismissal storage only for optional presentation state', () => {
    const popup = readFileSync(
      new URL('../../app/components/conversion/EngagementPopup.vue', import.meta.url),
      'utf8'
    )
    expect(popup).toContain('klyrow_engagement_dismissed')
    expect(popup).not.toContain('access_token')
    expect(popup).not.toContain('refresh_token')
    expect(popup).not.toContain('id_token')
    expect(popup).not.toContain('localStorage')
  })

  it('keeps every registry key aligned with the embedded definition ID', () => {
    expect(ids.every((id) => ctaRegistry[id].definition.id === id)).toBe(true)
  })
})

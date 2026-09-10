import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  englishContentPathFromRoute,
  englishPages,
  getMarketingPage,
  getMarketingPages,
  localeFromRoutePath,
  localizedContentPath,
  resolveMarketingCtaTarget,
  routeManifest,
  spanishPages
} from '../../content'

const locales = [englishPages, spanishPages] as const
const protectedStaticPublicRoutes = new Set([
  '/',
  '/contact',
  '/developers',
  '/platform',
  '/pricing',
  '/privacy',
  '/security',
  '/terms'
])
const externalContact = 'https://codestra.co/contact'

describe('localized content manifest', () => {
  it('contains exactly 46 pages for each locale', () => {
    expect(englishPages).toHaveLength(46)
    expect(spanishPages).toHaveLength(46)
    expect(routeManifest).toHaveLength(46)
    expect(getMarketingPages('en')).toBe(englishPages)
    expect(getMarketingPages('es')).toBe(spanishPages)
  })

  it('has one Spanish equivalent for every English path', () => {
    expect(spanishPages.map((page) => page.path).sort()).toEqual(
      englishPages.map((page) => page.path).sort()
    )
  })

  it('contains unique paths and IDs with complete entries', () => {
    const catalogPaths = new Set(englishPages.map((page) => page.path))
    expect(catalogPaths.size).toBe(46)

    for (const pages of locales) {
      expect(new Set(pages.map((page) => page.id)).size).toBe(46)
      expect(new Set(pages.map((page) => page.path)).size).toBe(46)
      for (const page of pages) {
        expect(page.title.length).toBeGreaterThan(5)
        expect(page.summary.length).toBeGreaterThan(30)
        expect(page.points).toHaveLength(3)
        expect(page.steps).toHaveLength(3)
        expect(page.primaryCta.target.startsWith('/')).toBe(true)
        expect(page.path.startsWith('/')).toBe(true)
        expect(page.path).not.toBe('/account')
        for (const related of page.related) {
          expect(
            catalogPaths.has(related) || protectedStaticPublicRoutes.has(related)
          ).toBe(true)
          expect(related).not.toBe('/account')
        }
      }
    }
  })

  it('resolves every route and emits canonical locale paths', () => {
    for (const entry of routeManifest) {
      expect(getMarketingPage('en', entry.path)?.id).toBe(entry.id)
      expect(getMarketingPage('es', entry.path)?.id).toBe(entry.id)
      expect(entry.esPath).toBe(localizedContentPath('es', entry.path))
      expect(entry.esPath === '/es' || entry.esPath.startsWith('/es/')).toBe(true)
    }
  })

  it('normalizes locale-aware routes without duplicating the Spanish prefix', () => {
    expect(localeFromRoutePath('/')).toBe('en')
    expect(localeFromRoutePath('/pricing')).toBe('en')
    expect(localeFromRoutePath('/es')).toBe('es')
    expect(localeFromRoutePath('/es/pricing/')).toBe('es')
    expect(englishContentPathFromRoute('/es')).toBe('/')
    expect(englishContentPathFromRoute('/es/pricing/')).toBe('/pricing')
    expect(localizedContentPath('es', '/es/pricing')).toBe('/es/pricing')
    expect(localizedContentPath('en', '/es/pricing')).toBe('/pricing')
  })

  it('never renders an inert self-link for a catalog CTA', () => {
    const observations = locales.flatMap((pages) =>
      pages.map((page) => {
        const target = resolveMarketingCtaTarget(
          page.locale,
          page.path,
          page.primaryCta.target,
          page.formId,
          externalContact
        )
        const selfTarget = page.primaryCta.target === page.path
        const expected = selfTarget
          ? page.formId
            ? externalContact
            : undefined
          : localizedContentPath(page.locale, page.primaryCta.target)
        return {
          current: localizedContentPath(page.locale, page.path),
          expected,
          selfTarget,
          target
        }
      })
    )

    expect(observations.map(({ target }) => target)).toEqual(
      observations.map(({ expected }) => expected)
    )
    expect(
      observations
        .filter(({ selfTarget }) => !selfTarget)
        .every(({ current, target }) => current !== target)
    ).toBe(true)
  })

  it('routes a self-targeting form to the governed external contact handoff', () => {
    expect(
      resolveMarketingCtaTarget(
        'es',
        '/contact',
        '/contact',
        'contact-sales',
        externalContact
      )
    ).toBe(externalContact)
    expect(
      resolveMarketingCtaTarget(
        'en',
        '/resource',
        '/resource',
        undefined,
        externalContact
      )
    ).toBeUndefined()
  })

  it('keeps Spanish shell navigation and all catalog alternates centralized', () => {
    const app = readFileSync(new URL('../../app/app.vue', import.meta.url), 'utf8')
    const header = readFileSync(
      new URL('../../app/components/AppHeader.vue', import.meta.url),
      'utf8'
    )
    const footer = readFileSync(
      new URL('../../app/components/AppFooter.vue', import.meta.url),
      'utf8'
    )

    expect(app).toContain('routeManifest')
    expect(app).toContain("hreflang: 'en'")
    expect(app).toContain("hreflang: 'es'")
    expect(header).toContain('localizedContentPath')
    expect(header).toContain("localize('/contact')")
    expect(footer).toContain('localizedContentPath')
    expect(footer).toContain(':to="localize(link[1])"')
  })

  it('keeps Spanish summaries substantive rather than copied', () => {
    for (const english of englishPages) {
      const spanish = getMarketingPage('es', english.path)
      expect(spanish).toBeDefined()
      expect(spanish?.locale).toBe('es')
      expect(spanish?.summary).not.toBe(english.summary)
    }
  })
})

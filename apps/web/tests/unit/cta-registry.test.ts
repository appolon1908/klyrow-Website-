import { describe, expect, it } from 'vitest'
import { englishPages } from '../../content'
import { ctaRegistry, formRouteMap } from '../../app/data/cta-registry'

describe('CTA registry', () => {
  const routes = new Set(englishPages.map((page) => page.path))

  it('contains no empty or unsafe targets', () => {
    for (const { definition } of Object.values(ctaRegistry)) {
      expect(definition.target).not.toBe('')
      expect(definition.target).not.toBe('#')
      expect(definition.target.startsWith('javascript:')).toBe(false)
    }
  })

  it('resolves every route and form destination', () => {
    for (const { definition, fallbackRoute } of Object.values(ctaRegistry)) {
      if (definition.kind === 'route') expect(routes.has(definition.target)).toBe(true)
      if (definition.kind === 'form') expect(routes.has(formRouteMap[definition.target] ?? '')).toBe(true)
      if (fallbackRoute) expect(routes.has(fallbackRoute)).toBe(true)
    }
  })

  it('has complete bilingual labels', () => {
    for (const registered of Object.values(ctaRegistry)) {
      expect(registered.labels.en.length).toBeGreaterThan(2)
      expect(registered.labels.es.length).toBeGreaterThan(2)
    }
  })
})

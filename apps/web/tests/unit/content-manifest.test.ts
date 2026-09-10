import { describe, expect, it } from 'vitest'
import { englishPages, routeManifest, spanishPages } from '../../content'

describe('localized content manifest', () => {
  it('contains exactly 46 pages for each locale', () => {
    expect(englishPages).toHaveLength(46)
    expect(spanishPages).toHaveLength(46)
    expect(routeManifest).toHaveLength(46)
  })

  it('has one Spanish equivalent for every English path', () => {
    expect(spanishPages.map((page) => page.path).sort()).toEqual(englishPages.map((page) => page.path).sort())
  })

  it('contains unique, complete entries and valid related paths', () => {
    const paths = new Set(englishPages.map((page) => page.path))
    expect(paths.size).toBe(46)
    for (const page of [...englishPages, ...spanishPages]) {
      expect(page.title.length).toBeGreaterThan(5)
      expect(page.summary.length).toBeGreaterThan(30)
      expect(page.points).toHaveLength(3)
      expect(page.steps).toHaveLength(3)
      for (const related of page.related) expect(paths.has(related)).toBe(true)
    }
  })
})

import { describe, expect, it } from 'vitest'
import { createConsentPreferences, parseConsentPreferences } from '../../legal/consent'

describe('consent preferences', () => {
  it('defaults optional categories to false', () => {
    expect(createConsentPreferences()).toMatchObject({ necessary: true, preferences: false, analytics: false, marketing: false })
  })

  it('round-trips a valid preference record and rejects malformed values', () => {
    const saved = createConsentPreferences({ preferences: true, analytics: true }, 'settings')
    expect(parseConsentPreferences(JSON.stringify(saved))).toEqual(saved)
    expect(parseConsentPreferences('{bad')).toBeNull()
  })
})

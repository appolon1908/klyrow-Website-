import { describe, expect, it } from 'vitest'
import { apiSandboxFixture, createMigrationPlan, normalizeDomain, parsePricingConfiguration, pricingEstimate } from '../../server/services/tool-service'

describe('interactive tool service', () => {
  it('normalizes domains and rejects URLs or IP literals', () => { expect(normalizeDomain('Mail.Example.COM.')).toBe('mail.example.com'); expect(() => normalizeDomain('https://example.com')).toThrow(); expect(() => normalizeDomain('127.0.0.1')).toThrow() })
  it('never invents pricing without approved configuration', () => { expect(pricingEstimate({}, 'contact_sales')).toMatchObject({ status: 'configuration_required', non_binding: true }); expect(parsePricingConfiguration('{bad')).toBeNull() })
  it('keeps the API sandbox side-effect free', () => { expect(apiSandboxFixture({ scenario: 'accepted' })).toMatchObject({ sent: false, status: 'simulated' }) })
  it('adds suppression risk to incomplete migration inputs', () => { expect(createMigrationPlan({ domains: 1, templates: 2, suppressions_available: false }).risks.join(' ')).toContain('Suppression') })
})

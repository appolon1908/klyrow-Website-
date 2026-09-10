import { describe, expect, it } from 'vitest'
import { websiteIntegrationMappings } from '../../server/integrations/website-event-mappings'

describe('website integration mappings', () => {
  it('maps every website event exactly once', () => {
    expect(websiteIntegrationMappings).toHaveLength(16)
    expect(new Set(websiteIntegrationMappings.map((entry) => entry.eventType)).size).toBe(websiteIntegrationMappings.length)
  })

  it('keeps Odoo and n8n as intents behind middleware', () => {
    expect(websiteIntegrationMappings.every((entry) => entry.odooIntent && entry.n8nIntent)).toBe(true)
  })
})

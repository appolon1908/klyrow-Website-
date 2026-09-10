import { describe, expect, it } from 'vitest'
import { apiOperations } from '../../server/registry/api-operations'
import { publicForms } from '../../app/data/form-registry'

describe('public form registry', () => {
  it('registers one unique endpoint per form', () => {
    expect(publicForms).toHaveLength(16)
    expect(new Set(publicForms.map((form) => form.id)).size).toBe(publicForms.length)
    expect(new Set(publicForms.map((form) => form.endpoint)).size).toBe(publicForms.length)
  })

  it('maps every form to a registered BFF operation', () => {
    const paths = new Set(apiOperations.filter((operation) => operation.method === 'POST').map((operation) => operation.path))
    for (const form of publicForms) expect(paths.has(form.endpoint)).toBe(true)
  })

  it('keeps required email and consent paths on every request', () => {
    for (const form of publicForms) {
      expect(form.fields.some((field) => field.key === 'email' && field.required)).toBe(true)
      expect(form.serviceContactRequired).toBe(true)
    }
  })
})

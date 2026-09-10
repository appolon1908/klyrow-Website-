import { describe, expect, it } from 'vitest'
import { conditionalLegalTemplates, getLegalDocuments, legalDocuments } from '../../legal'
import { storageTechnologies } from '../../legal/storage-technologies'

describe('legal and cookie registry', () => {
  it('provides twelve matching draft documents per locale', () => {
    expect(getLegalDocuments('en')).toHaveLength(12)
    expect(getLegalDocuments('es')).toHaveLength(12)
    expect(legalDocuments.every((document) => document.status === 'draft' && document.indexable === false)).toBe(true)
  })

  it('keeps route and document identifiers unique', () => {
    expect(new Set(legalDocuments.map((document) => `${document.locale}:${document.canonicalPath}`)).size).toBe(legalDocuments.length)
  })

  it('requires consent for every non-essential registered technology', () => {
    expect(storageTechnologies.filter((entry) => entry.category !== 'necessary').every((entry) => entry.consentRequired)).toBe(true)
    expect(conditionalLegalTemplates.every((entry) => entry.enabled === false)).toBe(true)
  })
})

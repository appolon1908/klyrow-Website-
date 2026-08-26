import { describe, expect, it } from 'vitest'
import {
  apiOperationDefinitionSchema,
  ctaDefinitionSchema,
  formDefinitionSchema,
  legalDocumentDefinitionSchema,
  storageTechnologyDefinitionSchema,
  websiteDomainEventEnvelopeSchema,
} from '@klyrow/contracts'
describe('contract exports', () => {
  it('keeps required schema exports reviewable', () => {
    expect(
      [
        apiOperationDefinitionSchema,
        ctaDefinitionSchema,
        formDefinitionSchema,
        legalDocumentDefinitionSchema,
        storageTechnologyDefinitionSchema,
        websiteDomainEventEnvelopeSchema,
      ].map((schema) => schema.type),
    ).toMatchSnapshot()
  })
})

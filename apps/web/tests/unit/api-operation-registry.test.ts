import { describe, expect, it } from 'vitest'
import { apiOperationDefinitionSchema } from '@klyrow/contracts'
import { apiOperations } from '../../server/registry/api-operations'

describe('API operation registry', () => {
  it('contains valid, unique operations', () => {
    const ids = new Set<string>()
    const methodPaths = new Set<string>()
    for (const item of apiOperations) {
      expect(() => apiOperationDefinitionSchema.parse(item)).not.toThrow()
      ids.add(item.operationId)
      methodPaths.add(`${item.method} ${item.path}`)
    }
    expect(ids.size).toBe(apiOperations.length)
    expect(methodPaths.size).toBe(apiOperations.length)
  })

  it('requires idempotency for every externally visible write', () => {
    for (const item of apiOperations.filter((operation) => ['POST', 'PUT'].includes(operation.method))) expect(item.requiresIdempotency).toBe(true)
  })
})

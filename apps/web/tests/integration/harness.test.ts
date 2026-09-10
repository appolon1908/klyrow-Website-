import { describe, expect, it } from 'vitest'
import type { HealthDependencies } from '../../server/foundation/api-ports'
describe('API integration harness', () => {
  it('models readiness dependencies without live integrations', () => {
    const dependencies: HealthDependencies = { readiness: [] }
    expect(dependencies.readiness).toHaveLength(0)
  })
})

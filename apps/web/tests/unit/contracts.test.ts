import { describe, expect, it } from 'vitest'
import {
  durableAcceptanceSchema,
  problemResponseSchema,
  requestContextSchema,
} from '@klyrow/contracts'
import { buildRequestContext } from '@klyrow/test-utils'
describe('shared contracts', () => {
  it('validates a request context built from one shared type', () => {
    expect(requestContextSchema.parse(buildRequestContext()).requestId).toBe('req_test')
  })
  it('requires a durable receipt', () => {
    expect(durableAcceptanceSchema.safeParse({ durable: true }).success).toBe(false)
  })
  it('validates RFC 7807 extensions', () => {
    expect(
      problemResponseSchema.safeParse({
        type: 'https://klyrow.com/problems/test',
        title: 'Test',
        status: 400,
        code: 'TEST',
        detail: 'Test',
        request_id: 'req_test',
      }).success,
    ).toBe(true)
  })
})

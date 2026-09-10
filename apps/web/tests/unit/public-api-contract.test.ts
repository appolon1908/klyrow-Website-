import { PassThrough } from 'node:stream'
import type { IncomingMessage } from 'node:http'
import { describe, expect, it } from 'vitest'
import { apiOperations } from '../../server/registry/api-operations'
import { buildPublicOpenApi, matchPublicOperations } from '../../server/services/openapi-service'
import { createRequestId } from '../../server/observability/request-context'
import { readBoundedBody } from '../../server/services/request-body-service'
import { submissionService } from '../../server/services/submission-service'

describe('public API contract', () => {
  it('exports standard OpenAPI paths and unique operation IDs for the catalog', () => {
    const document = buildPublicOpenApi('test-release')
    expect(document.openapi).toBe('3.1.0')
    const operations = Object.values(document.paths).flatMap(Object.values) as { operationId: string }[]
    expect(operations.map(item => item.operationId).sort()).toEqual(apiOperations.map(item => item.operationId).sort())
    expect(document.paths['/api/v1/privacy/requests/{publicToken}']).toBeDefined()
  })

  it('matches only declared paths and methods', () => {
    expect(matchPublicOperations('/api/v1/leads/demo').map(item => item.method)).toEqual(['POST'])
    expect(matchPublicOperations('/api/v1/privacy/requests/reference').map(item => item.method)).toEqual(['GET'])
    expect(matchPublicOperations('/api/v1/privacy/requests/reference/extra')).toEqual([])
    expect(matchPublicOperations('/api/v1/unknown')).toEqual([])
  })

  it('preserves valid correlation IDs and generates bounded IDs otherwise', () => {
    expect(createRequestId('req_known-123')).toBe('req_known-123')
    for (const candidate of [undefined, 'invalid', 'req_', 'req_' + 'x'.repeat(117)]) {
      expect(createRequestId(candidate)).toMatch(/^req_[a-f0-9]{32}$/)
    }
  })

  it('does not acknowledge a submission without a durable adapter', async () => {
    await expect(submissionService.submit({
      context: { requestId: 'req_test', receivedAt: new Date().toISOString(), locale: 'en', routeId: 'requestDemo', clientClass: 'test' },
      operationId: 'requestDemo', eventType: 'klyrow.website.demo.requested.v1', idempotencyKey: 'unconfigured-test-key', body: {}, locale: 'en'
    })).rejects.toMatchObject({ status: 503, code: 'MIDDLEWARE_UNAVAILABLE' })
  })

  it('reads a bounded request split across chunks', async () => {
    const stream = new PassThrough()
    const result = readBoundedBody(stream as unknown as IncomingMessage, 8)
    stream.write('{')
    stream.end('}')
    expect(await result).toBe('{}')
  })

  it('rejects a body beyond its byte budget without retaining subsequent chunks', async () => {
    const stream = new PassThrough()
    const result = readBoundedBody(stream as unknown as IncomingMessage, 8)
    stream.write('12345')
    stream.write('67890')
    stream.end('extra')
    await expect(result).rejects.toMatchObject({ status: 413 })
  })
})

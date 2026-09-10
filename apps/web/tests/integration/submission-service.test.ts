import { describe, expect, it, vi } from 'vitest'
import type { RequestContext } from '@klyrow/contracts'
import { MockMiddlewareAdapter } from '../../server/adapters/mock-middleware-adapter'
import { ApiProblem } from '../../server/errors/api-problem'
import { InMemorySubmissionRepository } from '../../server/repositories/in-memory-submission-repository'
import { SubmissionService } from '../../server/services/submission-service'

const context: RequestContext = { requestId: 'req_test', receivedAt: new Date().toISOString(), locale: 'en', routeId: 'requestDemo', clientClass: 'test' }
const body = { form_id: 'request-demo', locale: 'en' }

describe('submission service', () => {
  it('returns the original submission for a duplicate payload', async () => {
    const service = new SubmissionService(new InMemorySubmissionRepository(), new MockMiddlewareAdapter())
    const first = await service.submit({ context, operationId: 'requestDemo', eventType: 'klyrow.website.demo.requested.v1', idempotencyKey: 'same-key-12345', body, locale: 'en' })
    const duplicate = await service.submit({ context, operationId: 'requestDemo', eventType: 'klyrow.website.demo.requested.v1', idempotencyKey: 'same-key-12345', body, locale: 'en' })
    expect(duplicate.duplicate).toBe(true)
    expect(duplicate.submission_id).toBe(first.submission_id)
  })

  it('rejects a reused key with a different payload', async () => {
    const service = new SubmissionService(new InMemorySubmissionRepository(), new MockMiddlewareAdapter())
    await service.submit({ context, operationId: 'requestDemo', eventType: 'klyrow.website.demo.requested.v1', idempotencyKey: 'conflict-key-12345', body, locale: 'en' })
    await expect(service.submit({ context, operationId: 'requestDemo', eventType: 'klyrow.website.demo.requested.v1', idempotencyKey: 'conflict-key-12345', body: { ...body, locale: 'es' }, locale: 'es' })).rejects.toBeInstanceOf(ApiProblem)
  })
})

 it('coalesces concurrent identical submissions into one Middleware request', async () => {
  const adapter = new MockMiddlewareAdapter()
  const submit = vi.spyOn(adapter, 'submitWebsiteEvent')
  const service = new SubmissionService(new InMemorySubmissionRepository(), adapter)
  const input = { context, operationId: 'requestDemo', eventType: 'klyrow.website.demo.requested.v1', idempotencyKey: 'parallel-key-12345', body, locale: 'en' as const }
  const results = await Promise.all([service.submit(input), service.submit(input)])
  expect(submit).toHaveBeenCalledTimes(1)
  expect(results[0]?.submission_id).toBe(results[1]?.submission_id)
  expect(results[1]?.duplicate).toBe(true)
})

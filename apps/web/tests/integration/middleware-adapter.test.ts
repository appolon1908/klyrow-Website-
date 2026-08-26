import { createServer } from 'node:http'
import { once } from 'node:events'
import { afterEach, describe, expect, it } from 'vitest'
import type { RequestContext, WebsiteDomainEventEnvelope } from '@klyrow/contracts'
import { CodestraMiddlewareAdapter } from '../../server/adapters/codestra-middleware-adapter'

const servers: Array<ReturnType<typeof createServer>> = []
afterEach(async () => { await Promise.all(servers.splice(0).map((server) => new Promise<void>((resolve) => server.close(() => resolve())))) })
const context: RequestContext = { requestId: 'req_test123456', receivedAt: new Date().toISOString(), locale: 'en', routeId: 'requestDemo', clientClass: 'test' }
const event: WebsiteDomainEventEnvelope = { event_id: 'evt_test123456', event_type: 'klyrow.website.demo.requested.v1', occurred_at: new Date().toISOString(), source: 'klyrow-website', correlation_id: context.requestId, idempotency_key: 'idem_test123456789', locale: 'en', payload: { form_id: 'request-demo' } }

describe('CodestraMiddlewareAdapter', () => {
  it('accepts a durable middleware receipt and propagates correlation headers', async () => {
    let requestId = ''
    const server = createServer((request, response) => { requestId = String(request.headers['x-request-id'] ?? ''); response.writeHead(202, { 'content-type': 'application/json' }); response.end(JSON.stringify({ receipt_id: 'receipt_test', accepted_at: new Date().toISOString(), durable: true })) })
    servers.push(server); server.listen(0, '127.0.0.1'); await once(server, 'listening')
    const address = server.address(); if (!address || typeof address === 'string') throw new Error('test server address missing')
    const adapter = new CodestraMiddlewareAdapter({ middlewareMode: 'http', middlewareBaseUrl: `http://127.0.0.1:${address.port}`, middlewareEventPath: '/events', middlewareApiKeyFile: '', middlewareClientCertFile: '', middlewareClientKeyFile: '', middlewareCaFile: '', middlewareTimeoutMs: 1000, middlewareMaxRetries: 0, middlewareCircuitFailureThreshold: 2, middlewareCircuitResetMs: 1000 })
    const result = await adapter.submitWebsiteEvent(context, event, { idempotencyKey: event.idempotency_key, timeoutMs: 1000 })
    expect(result.receiptId).toBe('receipt_test'); expect(requestId).toBe(context.requestId)
  })
})

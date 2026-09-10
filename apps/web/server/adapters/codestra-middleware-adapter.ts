import { readFile } from 'node:fs/promises'
import { request as httpRequest } from 'node:http'
import type { IncomingMessage } from 'node:http'
import { request as httpsRequest } from 'node:https'
import type { RequestOptions } from 'node:https'
import type { DurableAcceptance, MiddlewareAdapter, RequestContext, WebsiteDomainEventEnvelope } from '@klyrow/contracts'
import { durableAcceptanceSchema } from '@klyrow/contracts'
import { ApiProblem } from '../errors/api-problem'
import type { MiddlewareRuntimeConfig } from '../config/middleware-config'
import { getWebsiteIntegrationMapping } from '../integrations/website-event-mappings'

interface WireAcceptance {
  receipt_id?: string
  receiptId?: string
  accepted_at?: string
  acceptedAt?: string
  durable?: boolean
}

const readSecretFile = async (path: string) => path ? (await readFile(path, 'utf8')).trim() : ''
const delay = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds))

export class CodestraMiddlewareAdapter implements MiddlewareAdapter {
  private consecutiveFailures = 0
  private openUntil = 0
  private credentials?: Promise<{ apiKey: string; cert: string; key: string; ca: string }>

  constructor(private readonly config: MiddlewareRuntimeConfig) {}

  async submitWebsiteEvent(
    context: RequestContext,
    event: WebsiteDomainEventEnvelope,
    options: { idempotencyKey: string; timeoutMs: number },
  ): Promise<DurableAcceptance> {
    if (Date.now() < this.openUntil) throw new ApiProblem(503, 'MIDDLEWARE_CIRCUIT_OPEN', 'The request service is temporarily unavailable.')
    const mapping = getWebsiteIntegrationMapping(event.event_type)
    if (!mapping) throw new ApiProblem(500, 'INTEGRATION_MAPPING_MISSING', 'The request type is not mapped for back-office delivery.')

    let lastError: unknown
    for (let attempt = 0; attempt <= this.config.middlewareMaxRetries; attempt += 1) {
      try {
        const acceptance = await this.post(context, event, options, mapping.odooIntent, mapping.n8nIntent)
        this.consecutiveFailures = 0
        return acceptance
      } catch (error: unknown) {
        lastError = error
        if (error instanceof ApiProblem && error.status < 500) throw error
        if (attempt < this.config.middlewareMaxRetries) await delay(Math.min(1000, 100 * 2 ** attempt))
      }
    }

    this.consecutiveFailures += 1
    if (this.consecutiveFailures >= this.config.middlewareCircuitFailureThreshold) {
      this.openUntil = Date.now() + this.config.middlewareCircuitResetMs
      this.consecutiveFailures = 0
    }
    if (lastError instanceof ApiProblem) throw lastError
    throw new ApiProblem(503, 'MIDDLEWARE_UNAVAILABLE', 'The request could not be stored by the integration service.')
  }

  private async getCredentials() {
    this.credentials ??= Promise.all([
      readSecretFile(this.config.middlewareApiKeyFile),
      readSecretFile(this.config.middlewareClientCertFile),
      readSecretFile(this.config.middlewareClientKeyFile),
      readSecretFile(this.config.middlewareCaFile),
    ]).then(([apiKey, cert, key, ca]) => ({ apiKey, cert, key, ca }))
    return this.credentials
  }

  private async post(
    context: RequestContext,
    event: WebsiteDomainEventEnvelope,
    options: { idempotencyKey: string; timeoutMs: number },
    odooIntent: string,
    n8nIntent: string,
  ): Promise<DurableAcceptance> {
    const base = new URL(this.config.middlewareBaseUrl)
    const url = new URL(this.config.middlewareEventPath, base)
    const credentials = await this.getCredentials()
    const body = JSON.stringify({ ...event, delivery: { odoo_intent: odooIntent, n8n_intent: n8nIntent } })
    const headers: Record<string, string | number> = {
      'content-type': 'application/json',
      'accept': 'application/json',
      'content-length': Buffer.byteLength(body),
      'x-request-id': context.requestId,
      'x-correlation-id': event.correlation_id,
      'x-klyrow-event-id': event.event_id,
      'idempotency-key': options.idempotencyKey,
    }
    if (credentials.apiKey) headers.authorization = `Bearer ${credentials.apiKey}`

    const response = await new Promise<{ status: number; body: string }>((resolve, reject) => {
      const requestOptions: RequestOptions = {
        method: 'POST',
        headers,
        timeout: Math.min(options.timeoutMs, this.config.middlewareTimeoutMs),
        ...(url.protocol === 'https:' ? {
          rejectUnauthorized: true,
          ...(credentials.cert ? { cert: credentials.cert } : {}),
          ...(credentials.key ? { key: credentials.key } : {}),
          ...(credentials.ca ? { ca: credentials.ca } : {}),
        } : {}),
      }
      const onResponse = (incoming: IncomingMessage) => {
        const chunks: Buffer[] = []
        let bytes = 0
        incoming.on('data', (chunk: Buffer) => {
          bytes += chunk.length
          if (bytes <= 65536) chunks.push(chunk)
        })
        incoming.on('end', () => resolve({ status: incoming.statusCode ?? 502, body: Buffer.concat(chunks).toString('utf8') }))
      }
      const request = url.protocol === 'https:'
        ? httpsRequest(url, requestOptions, onResponse)
        : httpRequest(url, requestOptions, onResponse)
      request.on('timeout', () => request.destroy(new Error('middleware timeout')))
      request.on('error', reject)
      request.end(body)
    })

    if (![200, 201, 202, 409].includes(response.status)) {
      if (response.status >= 500) throw new ApiProblem(503, 'MIDDLEWARE_UNAVAILABLE', 'The integration service is temporarily unavailable.')
      throw new ApiProblem(502, 'MIDDLEWARE_REJECTED', 'The integration service rejected the request.')
    }
    let payload: WireAcceptance
    try { payload = JSON.parse(response.body) as WireAcceptance }
    catch { throw new ApiProblem(502, 'MIDDLEWARE_RESPONSE_INVALID', 'The integration service returned an invalid receipt.') }
    return durableAcceptanceSchema.parse({
      receiptId: payload.receiptId ?? payload.receipt_id,
      acceptedAt: payload.acceptedAt ?? payload.accepted_at,
      durable: payload.durable,
    })
  }
}

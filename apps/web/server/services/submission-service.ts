import { createHash, randomUUID } from 'node:crypto'
import { durableAcceptanceSchema, type Locale, type MiddlewareAdapter, type RequestContext, type WebsiteDomainEventEnvelope } from '@klyrow/contracts'
import { ApiProblem } from '../errors/api-problem'
import { InMemorySubmissionRepository, type SubmissionRepository } from '../repositories/in-memory-submission-repository'
import { UnavailableMiddlewareAdapter } from '../adapters/unavailable-middleware-adapter'
import type { PublicSubmissionInput } from '../schemas/public-submission'

export interface SubmissionResult {
  submission_id: string
  status: 'accepted'
  duplicate: boolean
  next_action: 'show_success'
  received_at: string
  receipt_id: string
}

interface SubmissionInput {
  context: RequestContext
  operationId: string
  eventType: string
  idempotencyKey: string
  body: PublicSubmissionInput | Record<string, unknown>
  locale: Locale
}

export class SubmissionService {
  private readonly pending = new Map<string, Promise<SubmissionResult>>()
  constructor(
    private readonly repository: SubmissionRepository,
    private readonly middleware: MiddlewareAdapter,
  ) {}

  async submit(input: SubmissionInput): Promise<SubmissionResult> {
    const key = `${input.operationId}:${createHash('sha256').update(input.idempotencyKey).digest('hex')}`
    const active = this.pending.get(key)
    if (active) {
      await active.catch(() => undefined)
      return this.submit(input)
    }
    const operation = this.submitOnce(input)
    this.pending.set(key, operation)
    try {
      return await operation
    } finally {
      this.pending.delete(key)
    }
  }

  private async submitOnce(input: SubmissionInput): Promise<SubmissionResult> {
    const keyHash = createHash('sha256').update(input.idempotencyKey).digest('hex')
    const fingerprint = createHash('sha256').update(JSON.stringify(input.body)).digest('hex')
    const existing = await this.repository.get(input.operationId, keyHash)
    if (existing) {
      if (existing.fingerprint !== fingerprint) throw new ApiProblem(409, 'IDEMPOTENCY_CONFLICT', 'This idempotency key was already used with a different payload.')
      return { submission_id: existing.submissionId, status: 'accepted', duplicate: true, next_action: 'show_success', received_at: existing.acceptedAt, receipt_id: existing.receiptId }
    }

    const event: WebsiteDomainEventEnvelope = {
      event_id: `evt_${randomUUID().replaceAll('-', '')}`,
      event_type: input.eventType,
      occurred_at: new Date().toISOString(),
      source: 'klyrow-website',
      correlation_id: input.context.requestId,
      idempotency_key: input.idempotencyKey,
      locale: input.locale,
      payload: input.body,
    }
    const acceptance = await this.middleware.submitWebsiteEvent(input.context, event, { idempotencyKey: input.idempotencyKey, timeoutMs: 5000 })
    if (!durableAcceptanceSchema.safeParse(acceptance).success) throw new ApiProblem(503, 'MIDDLEWARE_REJECTED', 'The request could not be stored durably.')
    const submissionId = `sub_${randomUUID().replaceAll('-', '')}`
    await this.repository.save({ operationId: input.operationId, keyHash, fingerprint, submissionId, receiptId: acceptance.receiptId, acceptedAt: acceptance.acceptedAt })
    return { submission_id: submissionId, status: 'accepted', duplicate: false, next_action: 'show_success', received_at: acceptance.acceptedAt, receipt_id: acceptance.receiptId }
  }
}

export const submissionService = new SubmissionService(new InMemorySubmissionRepository(), new UnavailableMiddlewareAdapter())

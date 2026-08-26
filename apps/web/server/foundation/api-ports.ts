import type {
  DurableAcceptance,
  MiddlewareAdapter,
  RequestContext,
  WebsiteDomainEventEnvelope,
} from '@klyrow/contracts'

export interface RequestIdFactory {
  create(inbound?: string): string
}
export interface IdempotencyRecord {
  keyHash: string
  operation: string
  fingerprint: string
  status: 'pending' | 'accepted' | 'failed'
  expiresAt: string
}
export interface IdempotencyStore {
  find(keyHash: string): Promise<IdempotencyRecord | undefined>
  reserve(record: IdempotencyRecord): Promise<boolean>
}
export interface LimitDecision {
  allowed: boolean
  retryAfterSeconds?: number
}
export interface RequestLimiter {
  checkRate(context: RequestContext, operation: string): Promise<LimitDecision>
  checkBody(bytes: number, maximumBytes: number): LimitDecision
  checkCost(cost: number, maximumCost: number): LimitDecision
}
export interface OriginValidator {
  validate(origin: string | undefined, csrfToken: string | undefined): Promise<boolean>
}
export interface SafeRedirects {
  resolve(candidate: string, fallback: string): string
}
export interface StructuredLogger {
  info(event: string, fields: Readonly<Record<string, string | number | boolean>>): void
  error(event: string, fields: Readonly<Record<string, string | number | boolean>>): void
}
export interface Metrics {
  increment(name: string, labels?: Readonly<Record<string, string>>): void
  observe(name: string, value: number, labels?: Readonly<Record<string, string>>): void
}
export interface ReadinessDependency {
  name: string
  required: boolean
  check(): Promise<{ ready: boolean; reasonCode?: string }>
}
export interface HealthDependencies {
  readiness: readonly ReadinessDependency[]
}
export type MiddlewarePort = MiddlewareAdapter
export type MiddlewareSubmission = {
  context: RequestContext
  event: WebsiteDomainEventEnvelope
  acceptance: DurableAcceptance
}

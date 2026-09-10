import { z } from 'zod'

export const localeSchema = z.enum(['en', 'es'])
export type Locale = z.infer<typeof localeSchema>

export const requestContextSchema = z
  .object({
    requestId: z.string().startsWith('req_'),
    receivedAt: z.iso.datetime(),
    locale: localeSchema,
    routeId: z.string().min(1),
    clientClass: z.enum(['browser', 'server', 'test']),
    ipHash: z.string().optional(),
    userAgentClass: z.string().optional(),
    correlationId: z.string().optional(),
  })
  .readonly()
export type RequestContext = z.infer<typeof requestContextSchema>

export const successEnvelopeSchema = <T extends z.ZodType>(data: T) =>
  z.object({
    request_id: z.string().startsWith('req_'),
    status: z.string().min(1),
    received_at: z.iso.datetime(),
    data,
  })
export interface SuccessEnvelope<T> {
  request_id: string
  status: string
  received_at: string
  data: T
}

export const problemFieldSchema = z.object({ field: z.string(), code: z.string() })
export const problemResponseSchema = z.object({
  type: z.url(),
  title: z.string(),
  status: z.number().int().min(400).max(599),
  code: z.string(),
  detail: z.string(),
  request_id: z.string().startsWith('req_'),
  errors: z.array(problemFieldSchema).optional(),
})
export type ProblemResponse = z.infer<typeof problemResponseSchema>

export const routeDefinitionSchema = z.object({
  id: z.string(),
  path: z.string().startsWith('/'),
  locale: localeSchema,
  indexable: z.boolean(),
})
export type RouteDefinition = z.infer<typeof routeDefinitionSchema>

export const ctaDefinitionSchema = z.object({
  id: z.string(),
  labelKey: z.string(),
  kind: z.enum(['route', 'form', 'external', 'download', 'auth']),
  target: z.string().min(1),
  analyticsEvent: z.enum(['cta_click', 'pricing_cta_click', 'resource_download']),
  variant: z.enum(['primary', 'secondary', 'text']),
  consentRequired: z.boolean().optional(),
  allowedHosts: z.array(z.string()).optional(),
})
export type CtaDefinition = z.infer<typeof ctaDefinitionSchema>

export const formDefinitionSchema = z.object({
  id: z.string(),
  version: z.string(),
  operationId: z.string(),
  locale: localeSchema,
  fieldKeys: z.array(z.string()),
})
export type FormDefinition = z.infer<typeof formDefinitionSchema>

export const apiOperationDefinitionSchema = z.object({
  operationId: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  path: z.string().startsWith('/api/v1/'),
  requiresIdempotency: z.boolean(),
})
export type ApiOperationDefinition = z.infer<typeof apiOperationDefinitionSchema>

export const legalDocumentDefinitionSchema = z.object({
  id: z.string(),
  slug: z.string(),
  locale: localeSchema,
  title: z.string(),
  summary: z.string(),
  version: z.string(),
  status: z.enum(['draft', 'review', 'approved', 'retired']),
  effectiveDate: z.iso.date().optional(),
  lastUpdated: z.iso.date(),
  owner: z.enum(['legal', 'privacy', 'security', 'support', 'finance']),
  canonicalPath: z.string().startsWith('/'),
  indexable: z.boolean(),
  requiresAcceptance: z.boolean(),
  supersedesVersion: z.string().optional(),
  relatedDocuments: z.array(z.string()),
  contactRoute: z.string().optional(),
  featureFlag: z.string().optional(),
})
export type LegalDocumentDefinition = z.infer<typeof legalDocumentDefinitionSchema>

export const storageTechnologyDefinitionSchema = z.object({
  id: z.string(),
  namePattern: z.string(),
  provider: z.string(),
  purpose: z.string(),
  category: z.enum(['necessary', 'preferences', 'analytics', 'marketing']),
  mechanism: z.enum(['cookie', 'localStorage', 'sessionStorage', 'indexedDB', 'pixel', 'script']),
  firstParty: z.boolean(),
  duration: z.string(),
  domainScope: z.string(),
  secureRequired: z.boolean(),
  httpOnly: z.boolean().optional(),
  consentRequired: z.boolean(),
  enabledByFeature: z.string(),
})
export type StorageTechnologyDefinition = z.infer<typeof storageTechnologyDefinitionSchema>

export const websiteDomainEventEnvelopeSchema = z.object({
  event_id: z.string().startsWith('evt_'),
  event_type: z.string().regex(/^klyrow\.website\..+\.v1$/),
  occurred_at: z.iso.datetime(),
  source: z.literal('klyrow-website'),
  correlation_id: z.string(),
  idempotency_key: z.string(),
  locale: localeSchema,
  payload: z.record(z.string(), z.unknown()),
})
export type WebsiteDomainEventEnvelope = z.infer<typeof websiteDomainEventEnvelopeSchema>

export const durableAcceptanceSchema = z.object({
  receiptId: z.string().min(1),
  acceptedAt: z.iso.datetime(),
  durable: z.literal(true),
})
export type DurableAcceptance = z.infer<typeof durableAcceptanceSchema>

export interface MiddlewareAdapter {
  submitWebsiteEvent(
    context: RequestContext,
    event: WebsiteDomainEventEnvelope,
    options: { idempotencyKey: string; timeoutMs: number },
  ): Promise<DurableAcceptance>
}

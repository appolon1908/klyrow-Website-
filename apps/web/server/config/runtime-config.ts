import { z } from 'zod'

export const configurationClass = {
  PUBLIC_SAFE: 'PUBLIC_SAFE',
  SERVER_SECRET: 'SERVER_SECRET',
  SERVER_NON_SECRET: 'SERVER_NON_SECRET',
  RELEASE_REQUIRED: 'RELEASE_REQUIRED',
  OPTIONAL_INTEGRATION: 'OPTIONAL_INTEGRATION',
} as const
export type ConfigurationClass = (typeof configurationClass)[keyof typeof configurationClass]

export const configurationCatalog = {
  publicBaseUrl: { class: configurationClass.PUBLIC_SAFE, runtimePath: 'public.publicBaseUrl' },
  releaseSha: { class: configurationClass.RELEASE_REQUIRED, runtimePath: 'public.releaseSha', public: true },
  middlewareMode: { class: configurationClass.OPTIONAL_INTEGRATION, runtimePath: 'middlewareMode' },
  middlewareBaseUrl: { class: configurationClass.SERVER_NON_SECRET, runtimePath: 'middlewareBaseUrl' },
  middlewareEventPath: { class: configurationClass.SERVER_NON_SECRET, runtimePath: 'middlewareEventPath' },
  middlewareApiKeyFile: { class: configurationClass.SERVER_SECRET, runtimePath: 'middlewareApiKeyFile' },
  middlewareClientCertFile: { class: configurationClass.SERVER_SECRET, runtimePath: 'middlewareClientCertFile' },
  middlewareClientKeyFile: { class: configurationClass.SERVER_SECRET, runtimePath: 'middlewareClientKeyFile' },
  middlewareCaFile: { class: configurationClass.SERVER_SECRET, runtimePath: 'middlewareCaFile' },
  middlewareTimeoutMs: { class: configurationClass.SERVER_NON_SECRET, runtimePath: 'middlewareTimeoutMs' },
} as const

const serverRuntimeSchema = z.object({
  middlewareMode: z.enum(['mock', 'http']).default('mock'),
  middlewareBaseUrl: z.string().default(''),
  middlewareEventPath: z.string().startsWith('/').default('/v1/events/website'),
  middlewareApiKeyFile: z.string().default(''),
  middlewareClientCertFile: z.string().default(''),
  middlewareClientKeyFile: z.string().default(''),
  middlewareCaFile: z.string().default(''),
  middlewareTimeoutMs: z.number().int().positive().default(5000),
  middlewareMaxRetries: z.number().int().min(0).max(4).default(2),
  middlewareCircuitFailureThreshold: z.number().int().min(1).max(20).default(5),
  middlewareCircuitResetMs: z.number().int().positive().default(30000),
  public: z.object({
    releaseSha: z.string().min(1), publicBaseUrl: z.url(),
    signInUrl: z.string().default(''), docsUrl: z.string().default(''), statusUrl: z.string().default(''),
    schedulingUrl: z.string().default(''), pricingMode: z.string().default('contact_sales'),
    engagementPopupEnabled: z.boolean().default(false), announcement: z.string().default(''),
  }),
}).passthrough()

export type ServerRuntimeConfig = z.infer<typeof serverRuntimeSchema>
export type PublicRuntimeConfig = ServerRuntimeConfig['public']
export const parseServerRuntimeConfig = (input: unknown): ServerRuntimeConfig => serverRuntimeSchema.parse(input)
export const selectPublicRuntimeConfig = (config: ServerRuntimeConfig): PublicRuntimeConfig => ({ ...config.public })

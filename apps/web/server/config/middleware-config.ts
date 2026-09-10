import { z } from 'zod'

const middlewareConfigSchema = z.object({
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
}).passthrough()

export type MiddlewareRuntimeConfig = z.infer<typeof middlewareConfigSchema>
export const parseMiddlewareRuntimeConfig = (input: unknown): MiddlewareRuntimeConfig => {
  const config = middlewareConfigSchema.parse(input)
  if (config.middlewareMode === 'http') {
    const url = new URL(config.middlewareBaseUrl)
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Middleware URL must use http or https.')
    if (!config.middlewareEventPath.startsWith('/')) throw new Error('Middleware event path must be absolute.')
  }
  return config
}

export const middlewareReadiness = (input: unknown) => {
  const config = parseMiddlewareRuntimeConfig(input)
  if (config.middlewareMode === 'mock') return { mode: 'mock', state: 'mocked' }
  return { mode: 'http', state: config.middlewareBaseUrl ? 'configured' : 'missing' }
}

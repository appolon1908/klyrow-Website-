import type { MiddlewareAdapter } from '@klyrow/contracts'
import { CodestraMiddlewareAdapter } from './codestra-middleware-adapter'
import { MockMiddlewareAdapter } from './mock-middleware-adapter'
import { parseMiddlewareRuntimeConfig } from '../config/middleware-config'

export const createMiddlewareAdapter = (runtimeConfig: unknown): { adapter: MiddlewareAdapter; timeoutMs: number; cacheKey: string } => {
  const config = parseMiddlewareRuntimeConfig(runtimeConfig)
  if (config.middlewareMode === 'mock') return { adapter: new MockMiddlewareAdapter(), timeoutMs: config.middlewareTimeoutMs, cacheKey: 'mock' }
  return {
    adapter: new CodestraMiddlewareAdapter(config),
    timeoutMs: config.middlewareTimeoutMs,
    cacheKey: ['http', config.middlewareBaseUrl, config.middlewareEventPath].join(':'),
  }
}

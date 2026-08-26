import type { RequestContext } from '@klyrow/contracts'
export const buildRequestContext = (overrides: Partial<RequestContext> = {}): RequestContext => ({
  requestId: 'req_test',
  receivedAt: '2026-08-26T00:00:00Z',
  locale: 'en',
  routeId: 'test-route',
  clientClass: 'test',
  ...overrides,
})

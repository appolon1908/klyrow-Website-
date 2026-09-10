import { createHash, randomUUID } from 'node:crypto'
import type { Locale, RequestContext } from '@klyrow/contracts'

export const createRequestId = (inbound?: string) => (inbound && /^req_[A-Za-z0-9_-]{1,116}$/.test(inbound) ? inbound : `req_${randomUUID().replaceAll('-', '')}`)
export const hashClientIp = (ip: string | undefined) => (ip ? createHash('sha256').update(ip).digest('hex').slice(0, 24) : undefined)
export const createRequestContext = (input: {
  requestId: string
  locale: Locale
  routeId: string
  origin: string | undefined
  ip: string | undefined
  userAgent: string | undefined
}): RequestContext => {
  const ipHash = hashClientIp(input.ip)
  const userAgentClass = input.userAgent?.slice(0, 80)
  return {
    requestId: input.requestId,
    receivedAt: new Date().toISOString(),
    locale: input.locale,
    routeId: input.routeId,
    clientClass: input.origin ? 'browser' : 'server',
    correlationId: input.requestId,
    ...(ipHash ? { ipHash } : {}),
    ...(userAgentClass ? { userAgentClass } : {}),
  }
}

import type { MiddlewareAdapter, DurableAcceptance } from '@klyrow/contracts'
import { ApiProblem } from '../errors/api-problem'

/** Production default until the durable Middleware integration is configured. */
export class UnavailableMiddlewareAdapter implements MiddlewareAdapter {
  async submitWebsiteEvent(): Promise<DurableAcceptance> {
    throw new ApiProblem(503, 'MIDDLEWARE_UNAVAILABLE', 'Submission delivery is not configured. Please use the published contact channel.')
  }
}

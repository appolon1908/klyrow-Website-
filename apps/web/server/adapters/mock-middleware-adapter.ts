import { randomUUID } from 'node:crypto'
import type { DurableAcceptance, MiddlewareAdapter } from '@klyrow/contracts'

export class MockMiddlewareAdapter implements MiddlewareAdapter {
  async submitWebsiteEvent(): Promise<DurableAcceptance> {
    return { receiptId: `mock_${randomUUID().replaceAll('-', '')}`, acceptedAt: new Date().toISOString(), durable: true }
  }
}

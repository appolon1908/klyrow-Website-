export interface StoredSubmission {
  operationId: string
  keyHash: string
  fingerprint: string
  submissionId: string
  receiptId: string
  acceptedAt: string
}

export interface SubmissionRepository {
  get(operationId: string, keyHash: string): Promise<StoredSubmission | undefined>
  save(record: StoredSubmission): Promise<void>
}

export class InMemorySubmissionRepository implements SubmissionRepository {
  private readonly records = new Map<string, StoredSubmission>()
  async get(operationId: string, keyHash: string) {
    return this.records.get(`${operationId}:${keyHash}`)
  }
  async save(record: StoredSubmission) {
    this.records.set(`${record.operationId}:${record.keyHash}`, record)
  }
}

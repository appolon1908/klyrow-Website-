import type { IncomingMessage } from 'node:http'
import { ApiProblem } from '../errors/api-problem'

/** Bound retained bytes for both Content-Length and chunked requests. */
export const readBoundedBody = (request: IncomingMessage, limit = 65536): Promise<string> => new Promise((resolve, reject) => {
  const chunks: Buffer[] = []
  let bytes = 0
  let rejected = false
  request.on('data', (chunk: Buffer | string) => {
    if (rejected) return
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    bytes += buffer.length
    if (bytes > limit) {
      rejected = true
      chunks.length = 0
      reject(new ApiProblem(413, 'BODY_TOO_LARGE', 'The request body is too large.'))
      return
    }
    chunks.push(buffer)
  })
  request.once('end', () => { if (!rejected) resolve(Buffer.concat(chunks).toString('utf8') || '{}') })
  request.once('error', () => reject(new ApiProblem(400, 'MALFORMED_REQUEST', 'The request body could not be read.')))
  request.once('aborted', () => reject(new ApiProblem(400, 'MALFORMED_REQUEST', 'The request body was interrupted.')))
})

import { apiOperations } from '../registry/api-operations'

export const matchPublicOperations = (path: string) => apiOperations.filter((operation) => {
  const parts = operation.path.split('/')
  const actual = path.split('/')
  return parts.length === actual.length && parts.every((part, index) => part.startsWith(':') ? Boolean(actual[index]) : part === actual[index])
})

export const buildPublicOpenApi = (version: string) => {
  const paths: Record<string, Record<string, unknown>> = {}
  for (const operation of apiOperations) {
    const path = operation.path.replace(/:([A-Za-z]+)/g, '{$1}')
    const parameters: Record<string, unknown>[] = [...operation.path.matchAll(/:([A-Za-z]+)/g)].map((match) => ({ name: match[1], in: 'path', required: true, schema: { type: 'string' } }))
    if (operation.requiresIdempotency) parameters.push({ name: 'Idempotency-Key', in: 'header', required: true, schema: { type: 'string', minLength: 12, maxLength: 200 } })
    const item = paths[path] ?? (paths[path] = {})
    item[operation.method.toLowerCase()] = {
      operationId: operation.operationId,
      parameters,
      ...(operation.method !== 'GET' ? { requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } } } : {}),
      responses: {
        '200': { description: 'Public result. Tools return explicitly labelled simulations or estimates.' },
        '202': { description: 'Accepted only after durable Middleware acceptance; unavailable in this release.' },
        '400': { description: 'Invalid request or missing idempotency key.' },
        '403': { description: 'Origin or CSRF validation failed.' },
        '404': { description: 'Resource not found or unpublished.' },
        '405': { description: 'Method not allowed.' },
        '413': { description: 'Request exceeds the 64 KiB limit.' },
        '415': { description: 'JSON content type required.' },
        '422': { description: 'Validation failed.' },
        '429': { description: 'Local request limit exceeded.' },
        '503': { description: 'Durable submission, privacy status, or consent storage is not configured.' }
      }
    }
  }
  return { openapi: '3.1.0', info: { title: 'Klyrow Website BFF', version }, paths }
}

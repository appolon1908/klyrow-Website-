import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { setTimeout as delay } from 'node:timers/promises'

const server = spawn(process.execPath, ['apps/web/.output/server/index.mjs'], {
  env: { ...process.env, HOST: '127.0.0.1', PORT: '18755', NODE_ENV: 'production' },
  stdio: ['ignore', 'pipe', 'pipe']
})
let output = ''
server.stdout.on('data', chunk => { output += chunk })
server.stderr.on('data', chunk => { output += chunk })
const base = 'http://127.0.0.1:18755'
const request = async (path, status, options) => {
  const response = await fetch(base + path, { ...options, signal: AbortSignal.timeout(5000) })
  assert.equal(response.status, status, path)
  assert.match(response.headers.get('x-request-id') || '', /^req_[A-Za-z0-9_-]+$/)
  if (status >= 400) assert.match(response.headers.get('content-type'), /application\/problem\+json/)
  return response
}
try {
  let ready = false
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error(output)
    try { ready = (await fetch(base + '/api/v1/health')).ok } catch { /* local server starting */ }
    if (ready) break
    await delay(100)
  }
  assert.ok(ready, output)
  await request('/api/v1/health', 200)
  await request('/api/v1/ready', 503)
  await request('/api/v1/privacy/requests/test-reference', 503)
  const document = await (await request('/api/v1/openapi', 200)).json()
  assert.equal(document.openapi, '3.1.0')
  assert.equal(document.paths['/api/v1/leads/demo'].post.operationId, 'requestDemo')
  const config = await (await request('/api/v1/public/config', 200)).json()
  assert.equal(config.data.sign_in_url, 'https://app.klyrow.com/auth/login')
  const wrongMethod = await request('/api/v1/leads/demo', 405, { method: 'PUT' })
  assert.equal(wrongMethod.headers.get('allow'), 'POST')
  await request('/api/v1/unknown', 404, { method: 'POST' })
  const body = {
    form_id: 'request-demo', locale: 'en', submitted_at_client: new Date().toISOString(),
    page: { path: '/demo' }, contact: { email: 'test@example.invalid' },
    consent: { service_contact: true, policy_version: 'test' },
    anti_abuse: { started_at: new Date(Date.now() - 5000).toISOString() }
  }
  const post = { method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': 'local-smoke-test-key' }, body: JSON.stringify(body) }
  const response = await request('/api/v1/leads/demo', 503, post)
  assert.equal((await response.json()).code, 'MIDDLEWARE_UNAVAILABLE')
  await request('/api/v1/consent/cookies/reset', 503, post)
  const fixture = await (await request('/api/v1/tools/api-sandbox', 200, { ...post, body: '{}' })).json()
  assert.equal(fixture.data.sent, false)
  await request('/api/v1/tools/api-sandbox', 415, { ...post, headers: { 'idempotency-key': 'local-smoke-test-key', 'content-type': 'text/plain' } })
  console.log('Public API smoke passed: 12 HTTP contract and fail-closed checks.')
} finally {
  const exited = once(server, 'exit')
  if (server.exitCode === null) { server.kill('SIGTERM'); await exited }
}

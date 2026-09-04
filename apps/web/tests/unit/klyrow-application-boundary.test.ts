import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { applicationBoundary, klyrowDomains } from '../../app/config/domains'

const appRoot = fileURLToPath(new URL('../../app', import.meta.url))

const sourceFiles = (directory: string): string[] =>
  readdirSync(directory).flatMap((name) => {
    const path = join(directory, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(?:ts|vue)$/.test(path) ? [path] : []
  })

const unsafeAuthFiles = [
  'composables/useKlyrowSession.ts',
  'lib/klyrow-auth.ts',
  'middleware/klyrow-auth.ts',
  'plugins/klyrow-auth.client.ts'
]

const forbiddenMarkers = [
  'sessionStorage',
  'localStorage',
  'protocol/openid-connect/token',
  'authorization_code',
  'access_token',
  'refresh_token',
  'id_token'
]

describe('public website application boundary', () => {
  it('pins application handoffs to the canonical app origin', () => {
    expect(klyrowDomains.application).toBe('https://app.klyrow.com')
    expect(klyrowDomains.login).toBe('https://app.klyrow.com/auth/login')
    expect(klyrowDomains.signup).toBe('https://app.klyrow.com/auth/signup')
    expect(new URL(klyrowDomains.login).origin).toBe(klyrowDomains.application)
    expect(new URL(klyrowDomains.signup).origin).toBe(klyrowDomains.application)
  })

  it('declares the marketing surface public-only with forbidden token storage', () => {
    expect(applicationBoundary.marketingSurface).toBe('public-only')
    expect(applicationBoundary.authentication).toBe('external-application-handoff')
    expect(applicationBoundary.browserTokenStorage).toBe('forbidden')
    expect(applicationBoundary.authorityRepository).toBe('appolon1908-hue/klyrow.com')
    expect(applicationBoundary.durableIdentity).toBe('issuer+subject')
  })

  it('contains no browser identity implementation or token persistence markers', () => {
    for (const relativePath of unsafeAuthFiles) {
      expect(existsSync(join(appRoot, relativePath))).toBe(false)
    }

    const source = sourceFiles(appRoot)
      .map((path) => readFileSync(path, 'utf8'))
      .join('\n')

    for (const marker of forbiddenMarkers) {
      expect(source).not.toContain(marker)
    }
  })

  it('uses truthful public application handoffs in the shared header', () => {
    const header = readFileSync(join(appRoot, 'components/AppHeader.vue'), 'utf8')
    expect(header).toContain('Open app')
    expect(header).toContain('Create account')
    expect(header).toContain('klyrowDomains.application')
    expect(header).toContain('klyrowDomains.signup')
    expect(header).not.toMatch(/\b(?:sign|log)\s+(?:in|out)\b/i)
  })

  it('keeps the account route as a public noindex handoff', () => {
    const account = readFileSync(join(appRoot, 'pages/account.vue'), 'utf8')
    expect(account).toContain('noindex, nofollow, noarchive')
    expect(account).toContain('klyrowDomains.application')
    expect(account).toContain('browserTokenStorage')
    expect(account).not.toContain('definePageMeta')
    expect(account).not.toContain('useKlyrowSession')
  })
})

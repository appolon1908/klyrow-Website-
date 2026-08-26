import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import {
  configurationCatalog,
  parseServerRuntimeConfig,
  selectPublicRuntimeConfig,
} from '../../server/config/runtime-config'

const validConfig = {
  middlewareCredential: 'test-only-secret',
  requestTimeoutMs: 5000,
  middlewareEnabled: false,
  public: { releaseSha: 'sha_test', publicBaseUrl: 'http://localhost:3000' },
}

const sourceFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? sourceFiles(path) : [path]
  })

describe('runtime configuration separation', () => {
  it('selects only the explicit public object', () => {
    const selected = selectPublicRuntimeConfig(parseServerRuntimeConfig(validConfig))
    expect(selected).toEqual(validConfig.public)
    expect(JSON.stringify(selected)).not.toContain('test-only-secret')
  })
  it('does not classify a server secret as public', () => {
    expect(configurationCatalog.middlewareCredential).toEqual({
      class: 'SERVER_SECRET',
      runtimePath: 'middlewareCredential',
    })
    expect(configurationCatalog.middlewareCredential).not.toHaveProperty('public', true)
  })
  it('keeps server secret keys out of client source', () => {
    const clientSource = sourceFiles(join(process.cwd(), 'apps/web/app'))
      .filter((path) => ['.ts', '.vue'].includes(extname(path)))
      .map((path) => readFileSync(path, 'utf8'))
      .join('\n')
    expect(clientSource).not.toContain('middlewareCredential')
  })
})

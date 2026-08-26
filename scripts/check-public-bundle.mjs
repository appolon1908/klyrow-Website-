import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = 'apps/web/.output/public'
const files = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? files(path) : [path]
  })
const publicBundle = files(root).map((path) => readFileSync(path, 'utf8')).join('\n')
const forbidden = ['middlewareCredential', 'test-only-secret']
const exposed = forbidden.filter((value) => publicBundle.includes(value))
if (exposed.length) throw new Error(`Server-only configuration leaked into public output: ${exposed.join(', ')}`)
console.log('Public bundle secret-exclusion check passed.')

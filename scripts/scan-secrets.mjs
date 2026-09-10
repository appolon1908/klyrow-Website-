import { execFileSync } from 'node:child_process'

const patterns = [
  '-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----',
  'AKIA[0-9A-Z]{16}',
  '(middleware|odoo|n8n|keycloak)[_-]?(secret|token|password)\\s*[:=]\\s*["\\x27][^"\\x27]+',
]

for (const pattern of patterns) {
  try {
    const output = execFileSync(
      'git',
      [
        'grep',
        '--untracked',
        '-nEI',
        '-e',
        pattern,
        '--',
        ':!pnpm-lock.yaml',
        ':!scripts/scan-secrets.mjs',
      ],
      { encoding: 'utf8' },
    )
    process.stderr.write(output)
    process.exitCode = 1
  } catch (error) {
    if (error.status !== 1) throw error
  }
}

if (!process.exitCode)
  console.log('Secret scan passed: no credential-shaped repository content found.')

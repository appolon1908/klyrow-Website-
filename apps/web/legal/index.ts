export * from './consent'
export * from './registry'
export * from './schema'
export * from './storage-technologies'

import type { LegalUtilityRoute } from './schema'

const utilities = new Map<string, LegalUtilityRoute['kind']>([
  ['/cookie-settings', 'cookie-settings'],
  ['/privacy-request', 'privacy-request'],
  ['/do-not-sell-or-share', 'privacy-opt-out'],
  ['/legal/version-history', 'version-history'],
])

export const resolveLegalUtility = (path: string): LegalUtilityRoute | undefined => {
  const direct = utilities.get(path)
  if (direct) return { kind: direct, path }
  const match = path.match(/^\/privacy-request\/status\/([A-Za-z0-9_-]{8,200})$/)
  return match?.[1] ? { kind: 'privacy-status', path, token: match[1] } : undefined
}

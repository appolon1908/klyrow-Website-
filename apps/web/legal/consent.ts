export const consentVersion = 'cookie-policy-v1'

export interface ConsentPreferences {
  necessary: true
  preferences: boolean
  analytics: boolean
  marketing: boolean
  version: string
  updatedAt: string
  source: 'banner' | 'settings' | 'gpc' | 'api'
}

export const createConsentPreferences = (
  values: Partial<Pick<ConsentPreferences, 'preferences' | 'analytics' | 'marketing'>> = {},
  source: ConsentPreferences['source'] = 'settings',
): ConsentPreferences => ({
  necessary: true,
  preferences: Boolean(values.preferences),
  analytics: Boolean(values.analytics),
  marketing: Boolean(values.marketing),
  version: consentVersion,
  updatedAt: new Date().toISOString(),
  source,
})

export const parseConsentPreferences = (raw: string | null | undefined): ConsentPreferences | null => {
  if (!raw) return null
  try {
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== 'object') return null
    const candidate = value as Partial<ConsentPreferences>
    if (candidate.necessary !== true || candidate.version !== consentVersion) return null
    return {
      necessary: true,
      preferences: Boolean(candidate.preferences),
      analytics: Boolean(candidate.analytics),
      marketing: Boolean(candidate.marketing),
      version: consentVersion,
      updatedAt: typeof candidate.updatedAt === 'string' ? candidate.updatedAt : new Date().toISOString(),
      source: ['banner', 'settings', 'gpc', 'api'].includes(String(candidate.source))
        ? (candidate.source as ConsentPreferences['source'])
        : 'settings',
    }
  } catch {
    return null
  }
}

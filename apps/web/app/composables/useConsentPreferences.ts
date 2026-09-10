import { createConsentPreferences, parseConsentPreferences } from '../../legal/consent'
import type { ConsentPreferences } from '../../legal/consent'

const cookieName = 'klyrow_consent'
const readCookie = () => {
  if (!import.meta.client) return null
  const part = document.cookie.split('; ').find((entry) => entry.startsWith(`${cookieName}=`))
  return part ? decodeURIComponent(part.slice(cookieName.length + 1)) : null
}

export const useConsentPreferences = () => {
  const preferences = useState<ConsentPreferences | null>('klyrow-consent-preferences', () => null)
  const initialized = useState('klyrow-consent-initialized', () => false)

  const persist = (next: ConsentPreferences) => {
    preferences.value = next
    if (!import.meta.client) return
    const secure = location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${cookieName}=${encodeURIComponent(JSON.stringify(next))}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
    window.dispatchEvent(new CustomEvent('klyrow:consent-change', { detail: next }))
  }

  const save = (
    values: Partial<Pick<ConsentPreferences, 'preferences' | 'analytics' | 'marketing'>>,
    source: ConsentPreferences['source'] = 'settings',
  ) => persist(createConsentPreferences(values, source))

  onMounted(() => {
    if (initialized.value) return
    preferences.value = parseConsentPreferences(readCookie())
    const navigatorWithGpc = navigator as Navigator & { globalPrivacyControl?: boolean }
    if (!preferences.value && navigatorWithGpc.globalPrivacyControl === true) {
      save({ preferences: false, analytics: false, marketing: false }, 'gpc')
    }
    initialized.value = true
  })

  return {
    preferences: computed(() => preferences.value ?? createConsentPreferences()),
    initialized: readonly(initialized),
    hasDecision: computed(() => preferences.value !== null),
    acceptAll: () => save({ preferences: true, analytics: true, marketing: true }, 'banner'),
    rejectNonEssential: () => save({ preferences: false, analytics: false, marketing: false }, 'banner'),
    save,
    clear: () => {
      preferences.value = null
      if (import.meta.client) document.cookie = `${cookieName}=; Path=/; Max-Age=0; SameSite=Lax`
    },
  }
}

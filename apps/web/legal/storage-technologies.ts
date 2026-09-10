import type { StorageTechnologyDefinition } from '@klyrow/contracts'

export const storageTechnologies: StorageTechnologyDefinition[] = [
  {
    id: 'consent-preferences', namePattern: 'klyrow_consent', provider: 'Klyrow',
    purpose: 'Stores the visitor’s cookie-category choices and policy version.',
    category: 'necessary', mechanism: 'cookie', firstParty: true, duration: '12 months',
    domainScope: 'klyrow.com', secureRequired: true, httpOnly: false, consentRequired: false,
    enabledByFeature: 'legal-privacy-cookie-center',
  },
  {
    id: 'csrf-cookie', namePattern: 'klyrow_csrf', provider: 'Klyrow',
    purpose: 'Protects same-origin form and preference submissions.',
    category: 'necessary', mechanism: 'cookie', firstParty: true, duration: '1 hour',
    domainScope: 'current host', secureRequired: true, httpOnly: false, consentRequired: false,
    enabledByFeature: 'public-api-bff',
  },
  {
    id: 'locale-preference', namePattern: 'klyrow_locale', provider: 'Klyrow',
    purpose: 'Remembers the visitor’s selected language when enabled.',
    category: 'preferences', mechanism: 'cookie', firstParty: true, duration: '12 months',
    domainScope: 'klyrow.com', secureRequired: true, httpOnly: false, consentRequired: true,
    enabledByFeature: 'localized-content',
  },
  {
    id: 'engagement-popup', namePattern: 'klyrow_engagement_popup', provider: 'Klyrow',
    purpose: 'Applies a short-lived frequency cap to the optional engagement dialog.',
    category: 'preferences', mechanism: 'sessionStorage', firstParty: true, duration: 'Browser session',
    domainScope: 'current origin', secureRequired: true, consentRequired: true,
    enabledByFeature: 'engagement-popup',
  },
  {
    id: 'google-tag-manager', namePattern: 'GTM runtime', provider: 'Google',
    purpose: 'Loads configured analytics tags only after the applicable choice.',
    category: 'analytics', mechanism: 'script', firstParty: false, duration: 'Configured by tag',
    domainScope: 'Google domains', secureRequired: true, consentRequired: true,
    enabledByFeature: 'analytics-consent',
  },
  {
    id: 'google-analytics', namePattern: '_ga*', provider: 'Google',
    purpose: 'Measures approved aggregate website interactions when configured and permitted.',
    category: 'analytics', mechanism: 'cookie', firstParty: false, duration: 'Configured retention',
    domainScope: 'klyrow.com / Google', secureRequired: true, httpOnly: false, consentRequired: true,
    enabledByFeature: 'analytics-consent',
  },
]

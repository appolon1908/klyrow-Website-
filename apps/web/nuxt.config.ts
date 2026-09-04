export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: true,
  devtools: { enabled: false },
  css: ['~/assets/css/horizon.css', '~/assets/css/auth.css'],
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      titleTemplate: '%s',
      meta: [
        { name: 'application-name', content: 'Klyrow' },
        { name: 'theme-color', content: '#07090c' },
        { name: 'color-scheme', content: 'light dark' },
        { name: 'format-detection', content: 'telephone=no' }
      ]
    }
  },
  runtimeConfig: {
    middlewareCredential: '',
    requestTimeoutMs: 5000,
    public: {
      releaseSha: 'development',
      publicBaseUrl: 'http://localhost:3000',
      canonicalSiteUrl: 'https://klyrow.com',
      applicationBaseUrl: 'https://app.klyrow.com',
      applicationLoginUrl: 'https://app.klyrow.com/auth/login',
      applicationSignupUrl: 'https://app.klyrow.com/auth/signup'
    }
  },
  routeRules: {
    '/account': {
      headers: { 'x-robots-tag': 'noindex, nofollow, noarchive' }
    }
  },
  typescript: { strict: true, typeCheck: true }
})

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: true,
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s · Klyrow',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#5b4df7' },
        { name: 'color-scheme', content: 'light dark' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
  runtimeConfig: {
    middlewareCredential: '',
    requestTimeoutMs: 5000,
    public: {
      releaseSha: 'development',
      publicBaseUrl: 'http://localhost:3000',
      signInUrl: '',
      docsUrl: '',
      statusUrl: '',
      schedulingUrl: '',
      pricingMode: 'contact_sales',
      engagementPopupEnabled: false,
      announcement: '',
    },
  },
  typescript: { strict: true, typeCheck: true },
  nitro: { compressPublicAssets: true },
})

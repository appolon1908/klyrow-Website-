export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: true,
  devtools: { enabled: false },
  runtimeConfig: {
    middlewareCredential: '',
    requestTimeoutMs: 5000,
    public: { releaseSha: 'development', publicBaseUrl: 'http://localhost:3000' },
  },
  typescript: { strict: true, typeCheck: true },
})

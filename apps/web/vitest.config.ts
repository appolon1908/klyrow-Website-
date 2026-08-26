import { defineVitestConfig } from '@nuxt/test-utils/config'
import { fileURLToPath } from 'node:url'

export default defineVitestConfig({
  test: {
    name: 'component',
    include: ['tests/component/**/*.test.ts'],
    environment: 'nuxt',
    environmentOptions: { nuxt: { rootDir: fileURLToPath(new URL('.', import.meta.url)) } },
  },
})

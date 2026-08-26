import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'
import { fileURLToPath } from 'node:url'

const project = (name: string, include: string[], environment = 'node') => ({
  test: { name, include, environment, passWithNoTests: false },
})

export default defineConfig(async () => ({
  test: {
    projects: [
      project('unit', ['apps/web/tests/unit/**/*.test.ts', 'packages/**/*.test.ts']),
      await defineVitestProject({
        test: {
          name: 'component',
          include: ['apps/web/tests/component/**/*.test.ts'],
          environment: 'nuxt',
          environmentOptions: {
            nuxt: { rootDir: fileURLToPath(new URL('./apps/web', import.meta.url)) },
          },
        },
      }),
      project('integration', ['apps/web/tests/integration/**/*.test.ts']),
      project('contract', ['apps/web/tests/contract/**/*.test.ts']),
    ],
  },
}))

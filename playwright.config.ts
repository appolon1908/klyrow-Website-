import { defineConfig, devices } from '@playwright/test'

const localBaseUrl = process.env['PLAYWRIGHT_BASE_URL'] ?? 'http://127.0.0.1:3000'
if (!/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(localBaseUrl))
  throw new Error('Playwright is restricted to localhost; production access is prohibited.')

export default defineConfig({
  testDir: './apps/web/tests',
  testMatch: ['browser/**/*.spec.ts', 'accessibility/**/*.spec.ts'],
  use: { baseURL: localBaseUrl, trace: 'retain-on-failure' },
  webServer: {
    command: 'pnpm --filter @klyrow/web dev',
    url: localBaseUrl,
    reuseExistingServer: !process.env['CI'],
  },
  projects: [
    { name: 'browser', testMatch: 'browser/**/*.spec.ts', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'accessibility',
      testMatch: 'accessibility/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})

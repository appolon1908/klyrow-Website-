import { expect, test } from '@playwright/test'
test('SSR scaffold renders', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Website scaffold' })).toBeVisible()
})

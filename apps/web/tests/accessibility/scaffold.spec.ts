import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
test('scaffold has no automatically detectable accessibility violations', async ({ page }) => {
  await page.goto('/')
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

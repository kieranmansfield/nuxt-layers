import { expect, test } from '@playwright/test'

test('feed demo page renders the preview shell', async ({ page }) => {
  await page.goto('/feed/demo')

  await expect(page.getByRole('heading', { name: /Nuxt Layers Playground/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /Subscribe/i })).toHaveAttribute('href', /^feed:/)
  await expect(page.getByRole('link', { name: /Visit site/i })).toBeVisible()
})

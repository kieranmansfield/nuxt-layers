import { expect, test } from '@playwright/test'

test('feeds page renders the catalog', async ({ page }) => {
  await page.goto('/feeds')

  await expect(page.getByRole('heading', { name: /Feed catalog for/i })).toBeVisible()
  await expect(page.getByText('Global routes')).toBeVisible()
  await expect(page.getByText('/feed/rss', { exact: true })).toBeVisible()
})

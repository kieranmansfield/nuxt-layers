import { expect, test } from '@playwright/test'

test('feed index redirects to the default RSS route', async ({ page }) => {
  await page.goto('/feed')

  await expect(page).toHaveURL(/\/feed\/rss$/)
})

test('feed endpoints return the expected content types', async ({ page }) => {
  const routes = [
    ['/feed/rss', 'application/rss+xml'],
    ['/feed/atom', 'application/atom+xml'],
    ['/feed/json', 'application/feed+json'],
  ] as const

  for (const [path, contentType] of routes) {
    const response = await page.request.get(path)

    expect(response.ok()).toBeTruthy()
    expect(response.headers()['content-type']).toContain(contentType)
  }
})

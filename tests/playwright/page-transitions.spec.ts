import { expect, test } from '@playwright/test'

// Navigates /page-transitions → /page-transitions-target with a clicked [data-transition] link.
async function open(page: import('@playwright/test').Page) {
  await page.goto('/page-transitions')
  await page.waitForLoadState('networkidle')
}
const go = (page: import('@playwright/test').Page, name: string) =>
  page
    .locator('a[data-transition]')
    .first()
    .evaluate((a, n) => {
      const el = a as HTMLElement
      el.dataset.transition = n
      el.click()
    }, name)

test('wipe fills the overlay, swaps the page, then cleans up', async ({ page }) => {
  await open(page)
  await go(page, 'wipe')
  await expect(page.locator('html.is-page-transitioning')).toHaveAttribute(
    'data-page-transition',
    'wipe'
  )
  await expect(page.locator('#page-transition-overlay > div')).toHaveCount(1)
  await page.waitForURL('**/page-transitions-target')
  await expect(page.locator('html.is-page-transitioning')).toHaveCount(0)
  await expect(page.locator('#page-transition-overlay > div')).toHaveCount(0)
})

test('morph animates the shared data-flip-id box between pages', async ({ page }) => {
  await open(page)
  await go(page, 'morph')
  await page.waitForURL('**/page-transitions-target')
  const widths: number[] = []
  for (let i = 0; i < 8; i++) {
    widths.push(
      await page
        .locator('[data-flip-id="demo-box"]')
        .evaluate((e) => e.getBoundingClientRect().width)
    )
    await page.waitForTimeout(80)
  }
  expect(new Set(widths.map(Math.round)).size).toBeGreaterThan(2)
  await expect(page.locator('html.is-page-transitioning')).toHaveCount(0)
})

test('reduced motion swaps instantly with no overlay', async ({ browser }) => {
  const page = await (await browser.newContext({ reducedMotion: 'reduce' })).newPage()
  await open(page)
  await go(page, 'curved')
  await page.waitForURL('**/page-transitions-target')
  await expect(page.locator('html.is-page-transitioning')).toHaveCount(0)
  await expect(page.locator('#page-transition-overlay > div')).toHaveCount(0)
})

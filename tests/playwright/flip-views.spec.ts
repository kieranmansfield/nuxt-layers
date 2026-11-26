import { expect, test, type Page } from '@playwright/test'
import { sampleRects } from './sample-rects'

async function open(page: Page) {
  await page.goto('/flip-views')
  // networkidle can fire before hydration under load; a click before it has no handler
  await page.waitForFunction(() => window.useNuxtApp?.().isHydrating === false)
}

const pick = (page: Page, name: string) => page.getByRole('tab', { name }).click()
const views = (page: Page) => page.locator('#views [data-view]')

test('tagged elements travel to their match, then only the new view remains', async ({ page }) => {
  await open(page)
  await expect(views(page)).toHaveCount(1)
  const widths = sampleRects(page, '#views [data-view="list"] [data-flip-id="a:media"]', 'width')
  await pick(page, 'List')
  expect((await widths).size).toBeGreaterThan(2)

  await expect(views(page)).toHaveCount(1)
  await expect(views(page)).toHaveAttribute('data-view', 'list')
  await expect(page.locator('#views')).not.toHaveAttribute('style', /height/)
  await expect(views(page)).not.toHaveAttribute('style', /absolute/)
})

test('rapid switching ends on the last view only', async ({ page }) => {
  await open(page)
  for (const name of ['List', 'Compact', 'Cards', 'List', 'Compact']) {
    await pick(page, name)
    await page.waitForTimeout(70)
  }
  await expect(views(page)).toHaveCount(1)
  await expect(views(page)).toHaveAttribute('data-view', 'compact')
  await expect(page.locator('#views')).not.toHaveAttribute('style', /height/)
  await expect(page.locator('#views [data-flip-id="a:media"]')).not.toHaveAttribute(
    'style',
    /transform/
  )
})

test('useFlip morphs the same elements when the source changes', async ({ page }) => {
  await open(page)
  const lefts = sampleRects(page, '[data-flip-id="a"]', 'left')
  await page.getByRole('button', { name: 'Oldest first' }).click()
  expect((await lefts).size).toBeGreaterThan(2)
})

test('reduced motion swaps instantly', async ({ browser }) => {
  const page = await (await browser.newContext({ reducedMotion: 'reduce' })).newPage()
  await open(page)
  await pick(page, 'List')
  const state = await page.evaluate(() => {
    const all = [...document.querySelectorAll<HTMLElement>('#views [data-view]')]
    return { names: all.map((v) => v.dataset.view), style: all[0]?.getAttribute('style') ?? '' }
  })
  expect(state.names).toEqual(['list'])
  expect(state.style).not.toContain('absolute')
})

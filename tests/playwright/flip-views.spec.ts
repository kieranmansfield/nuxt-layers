import { expect, test, type Page } from '@playwright/test'

async function open(page: Page) {
  await page.goto('/flip-views')
  await page.waitForLoadState('networkidle')
}

const pick = (page: Page, name: string) => page.getByRole('tab', { name }).click()
const views = (page: Page) => page.locator('#views [data-view]')

test('tagged elements travel to their match, then only the new view remains', async ({ page }) => {
  await open(page)
  await expect(views(page)).toHaveCount(1)
  await pick(page, 'List')

  const media = page.locator('#views [data-view="list"] [data-flip-id="a:media"]')
  const widths: number[] = []
  for (let i = 0; i < 8; i++) {
    widths.push(await media.evaluate((e) => e.getBoundingClientRect().width))
    await page.waitForTimeout(60)
  }
  expect(new Set(widths.map(Math.round)).size).toBeGreaterThan(2)

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
  await page.getByRole('button', { name: 'Oldest first' }).click()
  const item = page.locator('[data-flip-id="a"]')
  const lefts: number[] = []
  for (let i = 0; i < 8; i++) {
    lefts.push(await item.evaluate((e) => e.getBoundingClientRect().left))
    await page.waitForTimeout(60)
  }
  expect(new Set(lefts.map(Math.round)).size).toBeGreaterThan(2)
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

import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test, type Page } from '@playwright/test'

// Vue only logs hydration mismatches to the console (warn per node, error summary), so a
// page can render fine and still fail to hydrate cleanly. Status/heading smoke tests miss
// that — this spec fails on any hydration console message or uncaught page error instead.
const pagesDir = resolve(__dirname, '../../apps/playground/app/pages')
const routes = readdirSync(pagesDir)
  .filter((f) => f.endsWith('.vue'))
  .map((f) => (f === 'index.vue' ? '/' : `/${f.replace(/\.vue$/, '')}`))
  .sort()

async function collectHydrationIssues(page: Page, path: string) {
  const issues: string[] = []
  page.on('console', (msg) => {
    const text = msg.text()
    if (/hydrat/i.test(text)) issues.push(text.split('\n').slice(0, 3).join(' | '))
  })
  page.on('pageerror', (err) => issues.push(`pageerror: ${err.message}`))

  await page.goto(path)
  // Nuxt exposes useNuxtApp on window in dev; wait until hydration has actually finished.
  await page
    .waitForFunction(() => window.useNuxtApp?.().isHydrating === false, null, { timeout: 30_000 })
    .catch(() => {})
  await page.waitForTimeout(500)
  return [...new Set(issues)]
}

for (const path of routes) {
  test(`${path} hydrates without mismatches`, async ({ page }) => {
    expect(await collectHydrationIssues(page, path)).toEqual([])
  })
}

// Regression: theme.client.ts used to apply the saved accent during plugin setup (before
// hydration), so any non-default saved accent mismatched the server-rendered HTML.
test('/theming hydrates cleanly with a non-default saved accent', async ({ page }) => {
  await page.addInitScript(() => {
    // Also runs in sandboxed frames where localStorage access throws
    try {
      localStorage.setItem('theme-colour', 'indigo')
      localStorage.setItem('theme-motion', 'reduced')
    } catch {}
  })
  expect(await collectHydrationIssues(page, '/theming')).toEqual([])
  await expect(page.locator('html')).toHaveAttribute('data-theme-colour', 'indigo')
})

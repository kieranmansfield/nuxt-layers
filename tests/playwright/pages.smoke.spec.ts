import { expect, test } from '@playwright/test'

// ponytail: no <main> landmark exists on layout:false demo pages (only the
// homepage uses the grid layout's <LayoutMain>), so every page here is
// checked via its DemoPageHero/LayoutPageHeader <h1> instead — cheap and
// still proves the page actually rendered, including the WebGPU/shader ones.
const pages = [
  { path: '/', name: 'Nuxt Layers Playground' },
  { path: '/metadata', name: 'Metadata Layer' },
  { path: '/scrollytelling', name: /SCROLLY/i },
  { path: '/forms', name: 'FORMS' },
  { path: '/content', name: 'CONTENT' },
  { path: '/theme', name: 'THEME' },
  { path: '/ui', name: 'UI' },
  { path: '/seo', name: 'SEO' },
  { path: '/nav', name: 'NAVIGATION' },
  { path: '/motion', name: /MOTION/i },
  { path: '/canvas', name: 'CANVAS LAYER' },
  { path: '/shader', name: /Utilities/i },
] as const

for (const { path, name } of pages) {
  test(`${path} renders without a 404`, async ({ page }) => {
    const response = await page.goto(path)

    expect(response?.status(), `${path} should not 404`).toBeLessThan(400)
    await expect(
      page.getByRole('heading', { level: 1, name, exact: typeof name === 'string' })
    ).toBeVisible()
  })
}

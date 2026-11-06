import { expect, test, type Page } from '@playwright/test'

const SAMPLE = 256

// Needs a real GPU: bundled headless Chromium has no WebGPU adapter, and software WebGPU
// (SwiftShader) drops its instance mid-render. Skips where there's no adapter; not part of CI.
test.use({ channel: 'chrome', launchOptions: { args: ['--enable-unsafe-webgpu'] } })
test.setTimeout(120_000)

async function open(page: Page, category: string, shape: string) {
  await page.goto('/shader-pipeline')
  await page.waitForLoadState('networkidle')
  const hasGpu = await page.evaluate(async () => !!(await navigator.gpu?.requestAdapter()))
  test.skip(!hasGpu, 'WebGPU unavailable')
  await page.getByRole('button', { name: category, exact: true }).click()
  await page.getByRole('button', { name: shape, exact: true }).click()
  await setSlider(page, 'Vignette', 0)
}

async function setSlider(page: Page, label: string, value: number) {
  const row = page.getByText(label, { exact: true }).locator('..')
  await row.locator('input[type=range]').fill(String(value))
  await page.waitForTimeout(400)
}

/** Greyscale canvas pixels from a real screenshot: a WebGPU canvas can't be read back after present. */
async function pixels(page: Page): Promise<number[]> {
  const png = (await page.locator('canvas').first().screenshot()).toString('base64')
  return page.evaluate(
    async ({ png, size }) => {
      const image = new Image()
      image.src = `data:image/png;base64,${png}`
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = size
      const context = canvas.getContext('2d')!
      context.drawImage(image, 0, 0, size, size)
      const { data } = context.getImageData(0, 0, size, size)
      return Array.from({ length: size * size }, (_, i) => data[i * 4]!)
    },
    { png, size: SAMPLE }
  )
}

/** Fraction of the canvas the bright shape spans along a row and a column through UV (x, y). */
function spans(grey: number[], x = 0.5, y = 0.5) {
  const col = Math.floor(x * SAMPLE)
  const row = Math.floor((1 - y) * SAMPLE)
  const bright = (n: number) => n > 128
  let across = 0
  let down = 0
  for (let i = 0; i < SAMPLE; i++) {
    if (bright(grey[row * SAMPLE + i]!)) across++
    if (bright(grey[i * SAMPLE + col]!)) down++
  }
  return { width: across / SAMPLE, height: down / SAMPLE }
}

/** Mean brightness of a small disc around UV (x, y). */
function brightnessAt(grey: number[], x: number, y: number, radius = 0.015) {
  const r = Math.ceil(radius * SAMPLE)
  const cx = Math.floor(x * SAMPLE)
  const cy = Math.floor((1 - y) * SAMPLE)
  let total = 0
  let count = 0
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy > r * r) continue
      total += grey[(cy + dy) * SAMPLE + cx + dx]!
      count++
    }
  }
  return total / count
}

test('Rectangle honours width and height independently', async ({ page }) => {
  await open(page, 'SDF Shapes', 'rectangle')

  await setSlider(page, 'Width', 0.6)
  await setSlider(page, 'Height', 0.2)
  let size = spans(await pixels(page))
  expect(size.width).toBeCloseTo(0.6, 1)
  expect(size.height).toBeCloseTo(0.2, 1)

  await setSlider(page, 'Height', 0.8)
  size = spans(await pixels(page))
  expect(size.width).toBeCloseTo(0.6, 1)
  expect(size.height).toBeCloseTo(0.8, 1)
})

test('Rectangle stays inside its size when the corner radius is too big', async ({ page }) => {
  await open(page, 'SDF Shapes', 'rectangle')

  await setSlider(page, 'Width', 0.6)
  await setSlider(page, 'Height', 0.1)
  await setSlider(page, 'Corner Radius', 0.2)
  const size = spans(await pixels(page))
  expect(size.width).toBeCloseTo(0.6, 1)
  expect(size.height).toBeCloseTo(0.1, 1)
})

test('Cross has arms set by size and thickness, and empty corners', async ({ page }) => {
  await open(page, 'SDF Shapes', 'cross')

  await setSlider(page, 'Size', 0.4)
  await setSlider(page, 'Thickness', 0.1)
  let grey = await pixels(page)
  expect(spans(grey).width).toBeCloseTo(0.8, 1)
  expect(spans(grey).height).toBeCloseTo(0.8, 1)
  // Through an arm, off centre: only the arm's thickness is lit
  expect(spans(grey, 0.5, 0.75).width).toBeCloseTo(0.1, 1)
  // Between the arms: nothing
  expect(brightnessAt(grey, 0.7, 0.7)).toBeLessThan(40)

  await setSlider(page, 'Size', 0.2)
  grey = await pixels(page)
  expect(spans(grey).width).toBeCloseTo(0.4, 1)
  expect(spans(grey, 0.5, 0.75).width).toBe(0)
})

test('LensFlare shows exactly ghostCount ghosts', async ({ page }) => {
  await open(page, 'Lighting', 'Lens Flare')
  await setSlider(page, 'Intensity', 1)

  // Ghost centres for the default source (0.7, 0.8), by `at` from the component's table
  const ghostAt = (at: number): [number, number] => [0.7 - 0.2 * at, 0.8 - 0.3 * at]
  const lift = (grey: number[], at: number) => {
    const [x, y] = ghostAt(at)
    // Against a ring just outside the ghost, so the moving noise behind it cancels out
    const ring = [0, 1, 2, 3].map((i) => {
      const angle = (i * Math.PI) / 2
      return brightnessAt(grey, x + Math.cos(angle) * 0.1, y + Math.sin(angle) * 0.1)
    })
    return brightnessAt(grey, x, y) - ring.reduce((sum, n) => sum + n, 0) / ring.length
  }

  await setSlider(page, 'Ghost Count', 1)
  let grey = await pixels(page)
  expect(lift(grey, 0.4)).toBeGreaterThan(20)
  expect(Math.abs(lift(grey, 0.7))).toBeLessThan(15)
  expect(Math.abs(lift(grey, 1.8))).toBeLessThan(15)

  await setSlider(page, 'Ghost Count', 8)
  grey = await pixels(page)
  expect(lift(grey, 0.7)).toBeGreaterThan(20)
  expect(lift(grey, 1.8)).toBeGreaterThan(5)
})

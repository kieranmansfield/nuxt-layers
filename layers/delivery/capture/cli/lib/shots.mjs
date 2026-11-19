// Screenshots: hero (viewport), scrolled sections and full-length pages, framed by Monkr.
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { openPage, scrollPos, slugOf, wheelTo } from './page.mjs'

// Chromium can't paint a canvas much taller than this, so longer pages stay unframed.
const MAX_FRAMED_HEIGHT = 30000

export const pngSize = (buf) => [buf.readUInt32BE(16), buf.readUInt32BE(20)]

/** Monkr device + colour for a capture device in a theme, or null when it isn't framed. */
export function frameFor(device, theme) {
  if (!device.frame) return null
  const deviceId =
    device.frame === 'browser' ? `browser-${theme === 'dark' ? 'dark' : 'light'}` : device.frame
  const colorId = typeof device.color === 'object' ? device.color?.[theme] : device.color
  return { deviceId, colorId }
}

export const captureName = (site, route, deviceName, theme) =>
  `${slugOf(route)}-${deviceName}${site.themes.length > 1 ? `-${theme}` : ''}`

async function save(path, buf) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, buf)
}

// Scroll the whole page once so lazy images load and scroll-triggered reveals play, then return.
async function warmUp(page, device) {
  const [, max] = await scrollPos(page)
  for (let y = 0; y < max; y += device.viewport.height * 0.8) await wheelTo(page, device, y)
  await wheelTo(page, device, max)
  await wheelTo(page, device, 0)
}

/** Run fn for every page x device x theme; a failure is logged and counted, not fatal. */
export async function eachCapture(site, routes, log, fn) {
  let failed = 0
  for (const route of routes) {
    const url = new URL(route, site.url).href
    for (const [deviceName, device] of Object.entries(site.devices)) {
      for (const theme of site.themes) {
        const name = captureName(site, route, deviceName, theme)
        try {
          await fn({ url, device, deviceName, theme, name })
        } catch (e) {
          failed++
          log(`  ✗ ${name}: ${e.message.split('\n')[0]}`)
        }
      }
    }
  }
  return failed
}

/** Capture every page x device x theme for a site. `monkr` is null when framing is off. */
export function captureShots(browser, monkr, site, routes, { log = console.log } = {}) {
  const out = join(site.outDir, site.name)
  const { shots } = site
  return eachCapture(site, routes, log, async ({ url, device, theme, name }) => {
    const frame = shots.frame && monkr ? frameFor(device, theme) : null
    const { width, height } = device.viewport

    // hero + sections, at shots.scale
    const { ctx, page } = await openPage(browser, url, {
      device,
      theme,
      scale: shots.scale,
      settleMs: site.settleMs,
    })
    const views = [await page.screenshot({ animations: 'disabled' })]
    for (let i = 1; i <= shots.sections; i++) {
      const [before] = await scrollPos(page)
      await wheelTo(page, device, i * height)
      const [after] = await scrollPos(page)
      if (after <= before) break // reached the end
      await page.waitForTimeout(600) // scroll-triggered reveals
      views.push(await page.screenshot({ animations: 'disabled' }))
    }
    await ctx.close()

    const section = (i) => `sections/${name}-${String(i).padStart(2, '0')}.png`
    if (shots.raw || !frame) {
      const dir = frame ? join(out, 'raw') : out
      await save(join(dir, `${name}.png`), views[0])
      for (let i = 1; i < views.length; i++) await save(join(dir, section(i)), views[i])
    }
    if (frame) {
      const framed = await monkr.frame({
        ...frame,
        shots: views,
        width: width * shots.scale,
        height: height * shots.scale,
        url,
        style: site.frame,
      })
      await save(join(out, `${name}.png`), framed[0])
      for (let i = 1; i < framed.length; i++) await save(join(out, section(i)), framed[i])
    }
    log(`  ✓ ${name}${views.length > 1 ? ` (+${views.length - 1} sections)` : ''}`)

    if (!shots.full) return
    const full = await openPage(browser, url, {
      device,
      theme,
      scale: shots.fullScale,
      settleMs: site.settleMs,
    })
    await warmUp(full.page, device)
    const shot = await full.page.screenshot({ fullPage: true, animations: 'disabled' })
    await full.ctx.close()
    const [w, h] = pngSize(shot)
    // Only a browser window stretches to a page's length; device screens have a fixed shape.
    const framesFull = frame?.deviceId.startsWith('browser-') && h <= MAX_FRAMED_HEIGHT
    if (shots.raw || !framesFull)
      await save(join(out, framesFull ? 'raw' : '', 'full', `${name}.png`), shot)
    if (framesFull) {
      const [framed] = await monkr.frame({
        ...frame,
        shots: [shot],
        width: w,
        height: h,
        url,
        style: site.frame,
      })
      await save(join(out, 'full', `${name}.png`), framed)
    }
    log(`  ✓ full/${name} (${w}x${h})`)
  })
}

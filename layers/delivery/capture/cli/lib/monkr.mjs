// Monkr (https://github.com/blaineam/Monkr, MIT) frames screenshots in browser windows and device
// mockups. It is a SvelteKit app, not an npm package, so we keep a pinned, sparse checkout of it,
// build it once, serve the build locally and drive its /headless route: the same renderer as its
// Export button. Only the frame art for the devices in use is downloaded (all of it is ~150 MB).
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { mkdir, readFile, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { homedir } from 'node:os'
import { extname, join } from 'node:path'

export const MONKR_REPO = 'https://github.com/blaineam/Monkr.git'
// Bump deliberately: the CLI relies on window.__monkr.render and the .monkr project shape.
export const MONKR_REF = 'a70294570f5a92255506c315dd7782368dd07c45'

// Monkr's browser frame is CSS with a placeholder address; we swap in the real one.
const PLACEHOLDER_URL = 'https://example.com'
// Monkr's frames lay out at most 600 css px wide, then scale to fit the canvas.
const MAX_DISPLAY_W = 600
const BROWSER_BORDER = 2

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts })
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed (exit ${r.status})`)
}

/** Default checkout location: shared between projects, one per pinned ref. */
export function defaultMonkrDir(ref = MONKR_REF) {
  const cache = process.env.XDG_CACHE_HOME ?? join(homedir(), '.cache')
  return join(cache, 'kmcom-capture', `monkr-${ref.slice(0, 12)}`)
}

/** Device slugs whose frame art must be on disk. CSS frames (browser, TV) have none. */
export function frameSlugs(devices, ids) {
  return [...new Set(ids)]
    .map((id) => devices.find((d) => d.id === id)?.slug)
    .filter((slug) => slug && slug !== '_css')
}

const sparsePatterns = (slugs) => [
  '/*',
  '!/legacy/',
  '!/static/backgrounds/',
  '!/static/devices/*/',
  ...slugs.map((s) => `/static/devices/${s}/`),
]

/**
 * Make sure a built Monkr exists at `dir`. A `managed` checkout is cloned, pinned and kept sparse
 * by us; an unmanaged one (MONKR_DIR / monkr.dir) is the caller's own clone and is only built.
 */
export function ensureMonkr({ dir, ref = MONKR_REF, managed = true, log = console.log }) {
  if (managed && !existsSync(join(dir, '.git'))) {
    log(`• Fetching Monkr ${ref.slice(0, 12)} → ${dir}`)
    run('git', ['init', '-q', dir])
    const git = (...args) => run('git', ['-C', dir, ...args])
    git('remote', 'add', 'origin', MONKR_REPO)
    git('fetch', '-q', '--depth', '1', '--filter=blob:none', 'origin', ref)
    git('sparse-checkout', 'set', '--no-cone', ...sparsePatterns([]))
    git('checkout', '-q', 'FETCH_HEAD')
  }
  if (!existsSync(join(dir, 'node_modules'))) {
    log('• Installing Monkr dependencies')
    // Monkr's own Playwright is unused (we bring the browser), so skip its download.
    run('npm', ['ci', '--no-audit', '--no-fund', '--loglevel=error'], {
      cwd: dir,
      env: { ...process.env, PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: '1' },
    })
  }
  if (!existsSync(join(dir, 'build', 'headless.html'))) {
    log('• Building Monkr')
    run('npm', ['run', 'build', '--silent'], { cwd: dir })
  }
}

/** Pull in frame art for these slugs. The server falls back to static/, so no rebuild is needed. */
export function ensureFrameArt({ dir, slugs, managed = true, log = console.log }) {
  const missing = slugs.filter((s) => !existsSync(join(dir, 'static', 'devices', s)))
  if (!missing.length) return
  if (!managed) throw new Error(`Monkr at ${dir} has no frame art for: ${missing.join(', ')}`)
  log(`• Fetching frame art: ${missing.join(', ')}`)
  const file = join(dir, '.git', 'info', 'sparse-checkout')
  const current = existsSync(file) ? readFileSync(file, 'utf8').split('\n').filter(Boolean) : []
  const slugsNow = current.map((l) => /^\/static\/devices\/([^/]+)\/$/.exec(l)?.[1]).filter(Boolean)
  run('git', [
    '-C',
    dir,
    'sparse-checkout',
    'set',
    '--no-cone',
    ...sparsePatterns([...slugsNow, ...missing]),
  ])
}

/** Static server for Monkr's build/ (SvelteKit-style routes), falling back to static/. */
function serve(dir) {
  const roots = [join(dir, 'build'), join(dir, 'static')]
  const server = createServer(async (req, res) => {
    const p = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    for (const root of roots) {
      for (const c of [join(root, p), join(root, `${p}.html`), join(root, p, 'index.html')]) {
        if (!c.startsWith(root)) continue
        if (existsSync(c) && (await stat(c)).isFile()) {
          res.writeHead(200, { 'content-type': MIME[extname(c)] ?? 'application/octet-stream' })
          return res.end(await readFile(c))
        }
      }
    }
    res.writeHead(404)
    res.end()
  })
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)))
}

// Runs inside Monkr's page. Rewrites the browser frame's placeholder address to
// window.__captureUrlBar, and top-aligns screenshots: Monkr's browser content area is slightly
// shorter than the screenshot's aspect, and object-cover would otherwise crop the top of the page.
function monkrPagePatch(placeholder) {
  const patched = new Set()
  const apply = () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (n.data.trim() === placeholder) patched.add(n)
    }
    const text = window.__captureUrlBar ?? placeholder
    for (const n of patched) {
      // writing the same text still counts as a mutation, which would re-trigger the observer
      if (n.isConnected && n.data !== text) n.data = text
    }
  }
  window.__captureApplyUrlBar = apply
  addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style')
    style.textContent = 'img[alt="Screenshot"]{object-position:top}'
    document.head.append(style)
    new MutationObserver(apply).observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    })
  })
}

/** How a frame lays out in Monkr, in its display units, for a screenshot of w x h. */
export function frameLayout(device, w, h) {
  const displayW = Math.min(device.pngW, MAX_DISPLAY_W)
  if (device.category === 'browser') {
    const chromeH = ((device.pngH - device.svgH) / device.pngW) * displayW
    return {
      displayW,
      displayH: displayW * (h / w) + chromeH,
      screenW: displayW - 2 * BROWSER_BORDER,
    }
  }
  return {
    displayW,
    displayH: displayW * (device.pngH / device.pngW),
    screenW: displayW * (device.svgW / device.pngW),
  }
}

/**
 * A .monkr project that frames one screenshot of w x h so its pixels map 1:1 onto the frame's
 * screen (export scale 1). `style` is { background, padding, shadow }.
 */
export function frameProject(device, colorId, w, h, style = {}) {
  const { displayW, displayH, screenW } = frameLayout(device, w, h)
  const k = w / screenW // canvas px per display unit
  const padding = style.padding ?? 0
  // even, for video encoders; nearest, so float noise doesn't add a column of padding
  const even = (n) => Math.round(n / 2) * 2
  const bg = style.background ?? 'transparent'
  const isGradient = /gradient\(/.test(bg)
  return {
    version: 3,
    background: {
      type: bg === 'transparent' ? 'transparent' : isGradient ? 'gradient' : 'solid',
      solidColor: isGradient || bg === 'transparent' ? '#000000' : bg,
      gradientCss: isGradient ? bg : 'linear-gradient(#000, #000)',
      gradientName: 'Custom',
      imageUrl: null,
    },
    canvasSize: {
      width: even(displayW * k + padding * 2),
      height: even(displayH * k + padding * 2),
      presetName: 'Custom',
    },
    padding,
    exportConfig: { scale: 1, format: 'png', trimTransparent: false },
    textOverlay: {},
    textBlocks: [],
    sceneObjects: [
      {
        id: 'capture',
        deviceId: device.id,
        deviceColorId: colorId ?? device.colors[0]?.id,
        screenshotUrl: null,
        screenshotFile: null,
        extraScreenshots: [],
        x: 50,
        y: 50,
        // Monkr fits a frame to the canvas but never past 1x; the object's scale does the rest
        scale: Math.max(k, 1),
        rotation: 0,
        tiltX: 0,
        tiltY: 0,
        shadow: {
          enabled: !!style.shadow,
          color: 'rgba(0,0,0,0.35)',
          blur: Math.round(w / 40),
          spread: 0,
          offsetX: 0,
          offsetY: Math.round(w / 80),
        },
        frameStyle: 'default',
        borderRadius: 16,
        glow: { enabled: false, color: 'rgba(255,255,255,0.6)', blur: 20, spread: 2 },
      },
    ],
  }
}

/** Address-bar text for a page URL: host + path, the way Safari shows it. */
export function urlBarText(url) {
  const u = new URL(url)
  const path = u.pathname.replace(/\/$/, '')
  return `${u.host}${path}`
}

/**
 * Start Monkr's renderer in `browser`. Returns { devices, frame, mask, composite, close }.
 * Call ensureMonkr() first.
 */
export async function startMonkr(browser, { dir, managed = true, log = console.log }) {
  const server = await serve(dir)
  const ctx = await browser.newContext({ deviceScaleFactor: 1 })
  await ctx.addInitScript(monkrPagePatch, PLACEHOLDER_URL)
  const page = await ctx.newPage()
  page.on('pageerror', (e) => log(`  [monkr] ${e.message}`))
  await page.goto(`http://127.0.0.1:${server.address().port}/headless`)
  await page.waitForFunction(() => !!window.__monkr, null, { timeout: 30000 })
  const devices = await page.evaluate(() => JSON.parse(JSON.stringify(window.__monkr.devices)))

  const device = (id) => {
    const d = devices.find((x) => x.id === id)
    if (!d)
      throw new Error(`Monkr has no device "${id}". Known: ${devices.map((x) => x.id).join(', ')}`)
    return d
  }

  /** Render screenshots (PNG buffers, all w x h) into a frame; returns PNG buffers. */
  async function frame({ deviceId, colorId, shots, width, height, url, style }) {
    const d = device(deviceId)
    ensureFrameArt({ dir, slugs: frameSlugs(devices, [deviceId]), managed, log })
    const project = frameProject(d, colorId, width, height, style)
    const screenshots = shots.map((b) => `data:image/png;base64,${b.toString('base64')}`)
    // device art has transparent margins: crop a transparent mockup to what's visible
    const trim = project.background.type === 'transparent'
    const out = await page.evaluate(
      async ({ project, screenshots, bar, trim }) => {
        window.__captureUrlBar = bar
        window.__captureApplyUrlBar()
        return window.__monkr.render({
          projectJson: project,
          screenshots,
          format: 'png',
          scale: 1,
          trim,
        })
      },
      { project, screenshots, bar: url ? urlBarText(url) : PLACEHOLDER_URL, trim }
    )
    return out.map((u) => Buffer.from(u.slice(u.indexOf(',') + 1), 'base64'))
  }

  /**
   * Prepare a compositor that drops video frames (JPEG buffers, w x h) into this frame. Renders
   * the frame twice, over black and white screens: their difference is exactly the screen's
   * coverage, antialiased edges included, so each frame composites as frame + coverage x video.
   */
  async function compositor({ deviceId, colorId, width, height, url, style }) {
    const solid = (color) =>
      page.evaluate(
        ({ w, h, color }) => {
          const c = Object.assign(document.createElement('canvas'), { width: w, height: h })
          const g = c.getContext('2d')
          g.fillStyle = color
          g.fillRect(0, 0, w, h)
          return c.toDataURL('image/png').split(',')[1]
        },
        { w: width, h: height, color }
      )
    const shots = [
      Buffer.from(await solid('#000'), 'base64'),
      Buffer.from(await solid('#fff'), 'base64'),
    ]
    const [black, white] = await frame({ deviceId, colorId, shots, width, height, url, style })
    const size = await page.evaluate(
      async ({ black, white }) => {
        const load = async (b64) =>
          createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob())
        const [a, b] = await Promise.all([load(black), load(white)])
        const w = a.width
        const h = a.height
        const canvas = (cw, ch) => {
          const c = Object.assign(document.createElement('canvas'), { width: cw, height: ch })
          return [c, c.getContext('2d', { willReadFrequently: true })]
        }
        const [ac, ag] = canvas(w, h)
        ag.drawImage(a, 0, 0)
        const [bc, bg] = canvas(w, h)
        bg.drawImage(b, 0, 0)
        const ad = ag.getImageData(0, 0, w, h).data
        const bd = bg.getImageData(0, 0, w, h)
        let x0 = w
        let y0 = h
        let x1 = -1
        let y1 = -1
        for (let i = 0; i < ad.length; i += 4) {
          // canvas data is straight alpha: compare premultiplied colour
          const d =
            Math.max(
              Math.abs(bd.data[i] * bd.data[i + 3] - ad[i] * ad[i + 3]),
              Math.abs(bd.data[i + 1] * bd.data[i + 3] - ad[i + 1] * ad[i + 3]),
              Math.abs(bd.data[i + 2] * bd.data[i + 3] - ad[i + 2] * ad[i + 3])
            ) / 255
          bd.data[i] = bd.data[i + 1] = bd.data[i + 2] = 0
          bd.data[i + 3] = d
          if (d > 8) {
            const p = i / 4
            const x = p % w
            const y = (p - x) / w
            if (x < x0) x0 = x
            if (x > x1) x1 = x
            if (y < y0) y0 = y
            if (y > y1) y1 = y
          }
        }
        bg.putImageData(bd, 0, 0)
        const ow = Math.ceil(w / 2) * 2
        const oh = Math.ceil(h / 2) * 2
        const [oc, og] = canvas(ow, oh)
        const [vc, vg] = canvas(w, h)
        window.__captureComposite = async (b64) => {
          const img = await createImageBitmap(
            await (await fetch(`data:image/jpeg;base64,${b64}`)).blob()
          )
          vg.globalCompositeOperation = 'copy'
          vg.drawImage(img, x0, y0, x1 - x0 + 1, y1 - y0 + 1)
          vg.globalCompositeOperation = 'destination-in'
          vg.drawImage(bc, 0, 0)
          og.fillStyle = '#000'
          og.fillRect(0, 0, ow, oh)
          og.drawImage(ac, 0, 0)
          og.drawImage(vc, 0, 0)
          const blob = await new Promise((r) => oc.toBlob(r, 'image/jpeg', 0.95))
          const bytes = new Uint8Array(await blob.arrayBuffer())
          let s = ''
          for (let i = 0; i < bytes.length; i += 0x8000)
            s += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
          return btoa(s)
        }
        return { width: ow, height: oh, screen: { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 } }
      },
      { black: black.toString('base64'), white: white.toString('base64') }
    )
    return {
      ...size,
      composite: async (jpeg) =>
        Buffer.from(
          await page.evaluate((b) => window.__captureComposite(b), jpeg.toString('base64')),
          'base64'
        ),
    }
  }

  return {
    devices,
    device,
    frame,
    compositor,
    async close() {
      await ctx.close()
      server.close()
    },
  }
}

/** Resolve where Monkr lives for a config: { dir, managed }. */
export async function resolveMonkr(monkr = {}) {
  const own = monkr.dir ?? process.env.MONKR_DIR
  const dir = own ?? defaultMonkrDir(monkr.ref)
  if (!own) await mkdir(join(dir, '..'), { recursive: true })
  return { dir, ref: monkr.ref ?? MONKR_REF, managed: !own }
}

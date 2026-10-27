#!/usr/bin/env node
// kmcom-capture: screenshots and scroll videos of sites, framed in browser windows and devices
// by Monkr. Run from a project with a capture.config.mjs, or ad hoc with --url.
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { loadConfig, resolveSite } from './lib/config.mjs'
import { discoverPages } from './lib/discover.mjs'
import { findFfmpeg } from './lib/ffmpeg.mjs'
import { ensureMonkr, resolveMonkr, startMonkr } from './lib/monkr.mjs'
import { captureShots } from './lib/shots.mjs'
import { captureVideos } from './lib/video.mjs'

const HELP = `kmcom-capture — framed screenshots and scroll videos of your sites

Usage:
  kmcom-capture [command] [options]

Commands:
  all       screenshots, then videos (default)
  shots     screenshots only
  video     scroll videos only
  pages     list the pages each site would capture, then exit

Options:
  -c, --config <file>    config file (default: ./capture.config.mjs)
  -s, --site <names>     only these sites (comma-separated names from the config)
  -u, --url <url>        capture this URL instead of the config's sites
  -p, --pages <paths>    paths to capture (comma-separated), or "auto" for sitemap/links
  -d, --devices <names>  only these devices (default: desktop,mobile)
  -t, --themes <names>   colour schemes (default: light,dark)
  -o, --out <dir>        output directory
      --full             also capture full-length pages
      --sections <n>     also capture up to n scrolled viewports per page
      --no-frame         skip Monkr; plain screenshots and videos
  -h, --help             show this help

Output: <out>/<site>/<page>-<device>[-<theme>].png, with raw/, full/, sections/ and video/
subfolders. Monkr is fetched and built on first use into ~/.cache/kmcom-capture
(set MONKR_DIR to use your own checkout). CAPTURE_CHROMIUM=<path> picks the browser binary,
FFMPEG=<path> the encoder.
`

const { values: opts, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    config: { type: 'string', short: 'c' },
    site: { type: 'string', short: 's' },
    url: { type: 'string', short: 'u' },
    pages: { type: 'string', short: 'p' },
    devices: { type: 'string', short: 'd' },
    themes: { type: 'string', short: 't' },
    out: { type: 'string', short: 'o' },
    full: { type: 'boolean' },
    sections: { type: 'string' },
    'no-frame': { type: 'boolean' },
    help: { type: 'boolean', short: 'h' },
  },
})

const command = positionals[0] ?? 'all'
if (opts.help || !['all', 'shots', 'video', 'pages'].includes(command)) {
  process.stdout.write(HELP)
  process.exit(opts.help ? 0 : 2)
}

const list = (s) =>
  s
    ?.split(',')
    .map((x) => x.trim())
    .filter(Boolean)
const log = (msg) => console.log(msg)

// From this package first, then from the project being captured (which usually has @playwright/test).
async function loadPlaywright() {
  const fromProject = createRequire(join(process.cwd(), 'noop.js'))
  for (const name of ['playwright', '@playwright/test']) {
    try {
      return (await import(name)).chromium
    } catch {}
    try {
      return fromProject(name).chromium
    } catch {}
  }
  throw new Error(
    'Playwright not found: add @playwright/test (or playwright) to your devDependencies'
  )
}

async function main() {
  const { file, config } = await loadConfig(opts.config)
  let sites = opts.url ? [{ url: opts.url }] : (config.sites ?? [])
  if (opts.site) {
    const wanted = list(opts.site)
    sites = sites.filter((s) => wanted.includes(s.name))
    const missing = wanted.filter((n) => !sites.some((s) => s.name === n))
    if (missing.length) throw new Error(`Unknown site(s): ${missing.join(', ')}`)
  }
  if (!sites.length) {
    throw new Error(
      file ? `No sites in ${file}` : 'No capture.config.mjs here: pass --url or --config'
    )
  }

  const overrides = {
    outDir: opts.out,
    themes: list(opts.themes),
    pages: opts.pages === 'auto' ? 'auto' : list(opts.pages),
    shots: {
      full: opts.full,
      sections: opts.sections === undefined ? undefined : Number(opts.sections),
      frame: opts['no-frame'] ? false : undefined,
    },
    video: {
      frame: opts['no-frame'] ? false : undefined,
      // pages named on the command line are filmed too
      pages: opts.pages === 'auto' ? 'all' : list(opts.pages),
    },
  }
  const resolved = sites.map((s) => {
    const site = resolveSite(config, s, overrides)
    const only = list(opts.devices)
    if (only)
      site.devices = Object.fromEntries(only.map((d) => [d, site.devices[d]]).filter(([, v]) => v))
    return site
  })

  const chromium = await loadPlaywright()
  const browser = await chromium.launch({
    executablePath: process.env.CAPTURE_CHROMIUM || undefined,
  })
  let monkr = null
  try {
    const wantsFrames = resolved.some(
      (s) => (command !== 'video' && s.shots.frame) || (command !== 'shots' && s.video.frame)
    )
    if (command !== 'pages' && wantsFrames) {
      const where = await resolveMonkr(resolved[0].monkr)
      ensureMonkr({ ...where, log })
      monkr = await startMonkr(browser, { ...where, log })
    }
    const ffmpeg = command === 'all' || command === 'video' ? findFfmpeg() : null

    let failed = 0
    for (const site of resolved) {
      log(`\n${site.name} — ${site.url}`)
      const routes = await discoverPages(browser, site, { log })
      if (command === 'pages') {
        routes.forEach((r) => log(`  ${r}`))
        continue
      }
      if (command !== 'video') failed += await captureShots(browser, monkr, site, routes, { log })
      if (command !== 'shots') {
        const videoRoutes = site.video.pages === 'all' ? routes : site.video.pages
        failed += await captureVideos(browser, monkr, ffmpeg, site, videoRoutes, { log })
      }
    }
    if (failed) {
      console.error(`\n✗ ${failed} capture(s) failed`)
      process.exitCode = 1
    }
  } finally {
    await monkr?.close()
    await browser.close()
  }
}

main().catch((e) => {
  console.error(`✗ ${e.message}`)
  process.exit(1)
})

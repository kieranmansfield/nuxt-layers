// capture.config.mjs: defaults, loading, and per-site resolution.
import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { basename, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export const DEFAULTS = {
  outDir: 'screenshots',
  themes: ['light', 'dark'],
  // explicit paths, or 'auto' = sitemap, then follow links
  pages: ['/'],
  maxPages: 12,
  crawlDepth: 2,
  exclude: [],
  pathDepth: Infinity, // 1 = home plus top-level pages (/about), no sub-pages (/blog/post)
  settleMs: 2500, // loading screen + entrance animations
  devices: {
    // 4320x2700 at 3x, in a browser window matching the theme
    desktop: {
      viewport: { width: 1440, height: 900 },
      mobile: false,
      frame: 'browser',
      bitrate: '12M',
    },
    // iPhone 17 Pro: its 402x874 viewport at 3x is exactly the frame's 1206x2622 screen
    mobile: {
      viewport: { width: 402, height: 874 },
      mobile: true,
      frame: 'iphone-17-pro',
      color: { light: 'silver', dark: 'deep-blue' },
      bitrate: '6M',
    },
  },
  // How framed images look. background: 'transparent' | a colour | a CSS gradient.
  frame: { background: 'transparent', padding: 0, shadow: false },
  shots: {
    scale: 3,
    frame: true,
    raw: true, // keep the unframed originals in raw/
    full: false, // full-length page, framed in a tall browser window on desktop
    fullScale: 2,
    sections: 0, // up to N extra framed shots, one per viewport scrolled
  },
  video: {
    pages: ['/'], // or 'all' for every captured page
    scale: 2,
    fps: 60,
    format: 'webm', // 'mp4' needs an ffmpeg with libx264
    frame: true,
    // videos have no alpha, so framed ones sit on a solid colour
    background: { light: '#f4f4f5', dark: '#09090b' },
    targetScrollSec: 30, // cover the page in ~30s, clamped to a readable range
    minSpeed: 350, // px/s
    maxSpeed: 900,
  },
  monkr: { dir: undefined, ref: undefined },
}

/** Identity helper for editor types in capture.config.mjs. */
export const defineCaptureConfig = (config) => config

const isObject = (v) => v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof RegExp)

/**
 * Deep merge; arrays and scalars from later sources replace earlier ones.
 * @returns {Record<string, any>}
 */
export function merge(...sources) {
  const out = {}
  for (const src of sources.filter(Boolean)) {
    for (const [k, v] of Object.entries(src)) {
      if (v === undefined) continue
      out[k] = isObject(v) && isObject(out[k]) ? merge(out[k], v) : v
    }
  }
  return out
}

/** Minimal YAML front matter: top-level `key: value` scalars only. */
export function frontMatter(md) {
  const block = /^---\r?\n([\s\S]*?)\r?\n---/.exec(md)?.[1] ?? ''
  const data = {}
  for (const line of block.split(/\r?\n/)) {
    const m = /^([A-Za-z_][\w-]*):\s*(.*?)\s*$/.exec(line)
    if (m && m[2] !== '') data[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2')
  }
  return data
}

/**
 * Sites from a Nuxt Content folder: one per .md file whose front matter has a URL in `field`.
 * The site name is the file name, so captures land next to the matching content entry.
 */
export async function sitesFromContent(dir, { field = 'link' } = {}) {
  const files = (await readdir(dir)).filter((f) => f.endsWith('.md')).sort()
  const sites = []
  for (const f of files) {
    const data = frontMatter(await readFile(join(dir, f), 'utf8'))
    if (data.draft === 'true' || !/^https?:\/\//.test(data[field] ?? '')) continue
    sites.push({ name: basename(f, '.md'), url: data[field] })
  }
  return sites
}

/**
 * Load capture.config.{mjs,js} from cwd (or `path`). Missing file = defaults, no sites.
 * The default export is the config, or a function given the helpers that returns it — which
 * keeps the config free of imports from this package.
 */
export async function loadConfig(path) {
  const candidates = path ? [path] : ['capture.config.mjs', 'capture.config.js']
  const file = candidates.map((p) => resolve(p)).find((p) => existsSync(p))
  if (path && !file) throw new Error(`Config not found: ${path}`)
  if (!file) return { file: null, config: {} }
  const mod = await import(pathToFileURL(file).href)
  const config =
    typeof mod.default === 'function'
      ? await mod.default({ DEFAULTS, sitesFromContent })
      : mod.default
  return { file, config: { ...config, sites: await config?.sites } }
}

/** Fully resolved settings for one site: defaults < config < site < CLI overrides. */
export function resolveSite(config, site, overrides = {}) {
  const r = merge(DEFAULTS, { ...config, sites: undefined }, site, overrides)
  if (!r.url) throw new Error(`Site "${r.name ?? '?'}" has no url`)
  r.name ??= new URL(r.url).hostname.replace(/^www\./, '').replace(/\./g, '-')
  // a config can drop a default device with `devices: { mobile: false }`
  r.devices = Object.fromEntries(Object.entries(r.devices).filter(([, d]) => d))
  return r
}

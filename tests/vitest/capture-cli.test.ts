import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  DEFAULTS,
  frontMatter,
  merge,
  resolveSite,
  sitesFromContent,
} from '../../layers/delivery/capture/cli/lib/config.mjs'
import {
  pagePath,
  parseSitemap,
  uniquePaths,
} from '../../layers/delivery/capture/cli/lib/discover.mjs'
import {
  frameLayout,
  frameProject,
  urlBarText,
} from '../../layers/delivery/capture/cli/lib/monkr.mjs'
import { slugOf } from '../../layers/delivery/capture/cli/lib/page.mjs'
import { captureName, frameFor, pngSize } from '../../layers/delivery/capture/cli/lib/shots.mjs'

// Registry entries as Monkr ships them (src/lib/stores/devices.svelte.ts)
const iphone = {
  id: 'iphone-17-pro',
  category: 'phone',
  pngW: 1508,
  pngH: 3278,
  svgW: 1206,
  svgH: 2623,
  colors: [{ id: 'cosmic-orange' }, { id: 'silver' }],
}
const browser = {
  id: 'browser-dark',
  category: 'browser',
  pngW: 960,
  pngH: 640,
  svgW: 960,
  svgH: 596,
  colors: [{ id: 'dark' }],
}

describe('capture config', () => {
  it('merges objects deeply and replaces arrays', () => {
    const out = merge({ a: { b: 1, c: [1, 2] }, d: 1 }, { a: { c: [3] }, d: undefined })
    expect(out).toEqual({ a: { b: 1, c: [3] }, d: 1 })
  })

  it('resolves a site over the defaults, config and overrides', () => {
    const site = resolveSite(
      { outDir: 'shots', sites: [], devices: { mobile: false } },
      { name: 'x', url: 'https://x.dev', themes: ['dark'] },
      { shots: { sections: 3 } }
    )
    expect(site.outDir).toBe('shots')
    expect(site.themes).toEqual(['dark'])
    expect(Object.keys(site.devices)).toEqual(['desktop'])
    expect(site.shots).toMatchObject({ scale: DEFAULTS.shots.scale, sections: 3 })
  })

  it('names a site after its host when the config does not', () => {
    expect(resolveSite({}, { url: 'https://www.athrugroup.com/' }).name).toBe('athrugroup-com')
  })

  it('reads top-level front matter scalars', () => {
    const md = '---\nname: Athru Group\nlink: "https://athrugroup.com"\nyear: 2025\n---\n# Body'
    expect(frontMatter(md)).toEqual({
      name: 'Athru Group',
      link: 'https://athrugroup.com',
      year: '2025',
    })
  })

  it('builds sites from a content folder, skipping drafts and entries without a URL', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'capture-content-'))
    writeFileSync(join(dir, 'b-site.md'), '---\nlink: https://b.dev\n---\n')
    writeFileSync(join(dir, 'a-site.md'), '---\nlink: https://a.dev/\n---\n')
    writeFileSync(join(dir, 'draft.md'), '---\nlink: https://c.dev\ndraft: true\n---\n')
    writeFileSync(join(dir, 'plugin.md'), '---\nlink: obsidian://plugin\n---\n')
    expect(await sitesFromContent(dir)).toEqual([
      { name: 'a-site', url: 'https://a.dev/' },
      { name: 'b-site', url: 'https://b.dev' },
    ])
  })
})

describe('page discovery', () => {
  it('parses sitemap locations, CDATA and entities included', () => {
    const xml = `<urlset><url><loc>https://x.dev/</loc></url>
      <url><loc><![CDATA[https://x.dev/a?b=1&amp;c=2]]></loc></url></urlset>`
    expect(parseSitemap(xml)).toEqual(['https://x.dev/', 'https://x.dev/a?b=1&c=2'])
  })

  it('keeps same-origin pages and drops assets, other sites and non-http links', () => {
    const base = 'https://x.dev/'
    expect(pagePath('/work/#top', base)).toBe('/work/')
    expect(pagePath('https://x.dev/about?ref=nav', base)).toBe('/about')
    expect(pagePath('/feed.xml', base)).toBeNull()
    expect(pagePath('/cv.pdf', base)).toBeNull()
    expect(pagePath('https://other.dev/', base)).toBeNull()
    expect(pagePath('mailto:hi@x.dev', base)).toBeNull()
  })

  it('dedupes trailing slashes and orders home first, then by depth', () => {
    expect(uniquePaths(['/work/a/', '/about', '/', '/about/', '/work/'])).toEqual([
      '/',
      '/about',
      '/work/',
      '/work/a/',
    ])
  })
})

describe('Monkr framing', () => {
  it('maps a 3x iPhone 17 Pro screenshot 1:1 onto the frame screen', () => {
    const { displayW, screenW } = frameLayout(iphone, 1206, 2622)
    expect(displayW).toBe(600)
    expect(screenW).toBeCloseTo(479.8, 1)
    const p = frameProject(iphone, 'silver', 1206, 2622)
    // canvas = frame art at native size: 1508 x 3278
    expect(p.canvasSize.width).toBe(1508)
    expect(p.canvasSize.height).toBe(3278)
    expect(p.sceneObjects[0]).toMatchObject({ deviceId: 'iphone-17-pro', deviceColorId: 'silver' })
    expect(p.background.type).toBe('transparent')
  })

  it('sizes a browser window to the screenshot, chrome included', () => {
    const p = frameProject(browser, undefined, 4320, 2700, { background: '#111', padding: 40 })
    // content is 596 of the window's 600 layout px, so 4320 px of content => 4349 px of window
    expect(p.canvasSize.width).toBe(Math.round((600 * (4320 / 596) + 80) / 2) * 2)
    expect(p.canvasSize.width % 2).toBe(0)
    expect(p.canvasSize.height % 2).toBe(0)
    expect(p.sceneObjects[0]).toMatchObject({ deviceColorId: 'dark' })
    expect(p.background).toMatchObject({ type: 'solid', solidColor: '#111' })
  })

  it('treats a CSS gradient as a gradient background', () => {
    const bg = 'linear-gradient(160deg, #1a0a2e, #0a1628)'
    expect(frameProject(browser, 'dark', 100, 100, { background: bg }).background).toMatchObject({
      type: 'gradient',
      gradientCss: bg,
    })
  })

  it('shows host and path in the address bar', () => {
    expect(urlBarText('https://athrugroup.com/')).toBe('athrugroup.com')
    expect(urlBarText('https://x.dev/work/a/?q=1')).toBe('x.dev/work/a')
  })

  it('picks a frame per theme', () => {
    const desktop = DEFAULTS.devices.desktop
    const mobile = DEFAULTS.devices.mobile
    expect(frameFor(desktop, 'dark')).toEqual({ deviceId: 'browser-dark', colorId: undefined })
    expect(frameFor(mobile, 'light')).toEqual({ deviceId: 'iphone-17-pro', colorId: 'silver' })
    expect(frameFor({ ...mobile, frame: false }, 'light')).toBeNull()
  })
})

describe('capture naming', () => {
  it('slugs routes', () => {
    expect(slugOf('/')).toBe('home')
    expect(slugOf('/work/athru-group/')).toBe('work-athru-group')
  })

  it('adds the theme only when a site has more than one', () => {
    expect(captureName({ themes: ['dark'] }, '/', 'desktop', 'dark')).toBe('home-desktop')
    expect(captureName({ themes: ['light', 'dark'] }, '/about', 'mobile', 'light')).toBe(
      'about-mobile-light'
    )
  })

  it('reads PNG dimensions from the header', () => {
    const header = Buffer.alloc(24)
    header.writeUInt32BE(1206, 16)
    header.writeUInt32BE(2622, 20)
    expect(pngSize(header)).toEqual([1206, 2622])
  })
})

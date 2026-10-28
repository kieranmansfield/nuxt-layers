// Find a site's pages: its sitemap first, then same-origin links from the start page.

const SKIP =
  /\.(xml|rss|atom|json|txt|pdf|zip|png|jpe?g|gif|webp|avif|svg|ico|mp4|webm|mp3|css|js)$/i

/** <loc> entries of a sitemap (or sitemap index). */
export function parseSitemap(xml) {
  return [...xml.matchAll(/<loc>\s*(?:<!\[CDATA\[)?\s*([^<\]\s]+)\s*(?:\]\]>)?\s*<\/loc>/g)].map(
    (m) => m[1].replace(/&amp;/g, '&')
  )
}

/** Same-origin page path for href, or null for assets, other origins and non-http links. */
export function pagePath(href, base) {
  let u
  try {
    u = new URL(href, base)
  } catch {
    return null
  }
  if (u.origin !== new URL(base).origin || !/^https?:$/.test(u.protocol)) return null
  if (SKIP.test(u.pathname)) return null
  return u.pathname
}

/** Dedupe paths that differ only by a trailing slash; home first, then shortest/alphabetical. */
export function uniquePaths(paths) {
  const seen = new Map()
  for (const p of paths) {
    const key = p.replace(/\/+$/, '') || '/'
    if (!seen.has(key)) seen.set(key, p)
  }
  return [...seen.values()].sort((a, b) => {
    const da = a.split('/').filter(Boolean).length
    const db = b.split('/').filter(Boolean).length
    return da - db || a.localeCompare(b)
  })
}

async function fromSitemap(request, base, log) {
  const urls = []
  const queue = [new URL('/sitemap.xml', base).href, new URL('/sitemap_index.xml', base).href]
  const seen = new Set()
  while (queue.length && seen.size < 20) {
    const url = queue.shift()
    if (seen.has(url)) continue
    seen.add(url)
    const res = await request.get(url, { timeout: 15000 }).catch(() => null)
    if (!res?.ok()) continue
    for (const loc of parseSitemap(await res.text())) {
      if (/\.xml($|\?)/.test(loc)) queue.push(loc)
      else urls.push(loc)
    }
    if (urls.length) break // one sitemap is enough; the index variant is a fallback
  }
  if (urls.length) log(`• ${urls.length} URL(s) in sitemap`)
  return urls.map((u) => pagePath(u, base)).filter(Boolean)
}

async function fromLinks(context, base, { max, depth }) {
  const found = new Set(['/'])
  let frontier = [new URL('/', base).pathname]
  const page = await context.newPage()
  try {
    for (let d = 0; d < depth && frontier.length && found.size < max; d++) {
      const next = []
      for (const path of frontier) {
        const ok = await page
          .goto(new URL(path, base).href, { waitUntil: 'domcontentloaded', timeout: 20000 })
          .catch(() => null)
        if (!ok) continue
        const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')))
        for (const h of hrefs) {
          const p = pagePath(h, base)
          const key = p?.replace(/\/+$/, '') || '/'
          if (!p || [...found].some((f) => (f.replace(/\/+$/, '') || '/') === key)) continue
          found.add(p)
          next.push(p)
          if (found.size >= max) break
        }
        if (found.size >= max) break
      }
      frontier = next
    }
  } finally {
    await page.close()
  }
  return [...found]
}

/**
 * Pages to capture for a site. `pages` is an explicit list of paths, or 'auto' to read the
 * sitemap and fall back to following links. Returns paths, home first, at most `max`.
 */
export async function discoverPages(browser, site, { log = console.log } = {}) {
  if (Array.isArray(site.pages)) return site.pages
  const context = await browser.newContext()
  try {
    let paths = await fromSitemap(context.request, site.url, log)
    if (!paths.length) {
      log('• No sitemap; following links')
      paths = await fromLinks(context, site.url, { max: site.maxPages, depth: site.crawlDepth })
    }
    const exclude = (site.exclude ?? []).map((e) => (e instanceof RegExp ? e : new RegExp(e)))
    return uniquePaths(['/', ...paths])
      .filter((p) => !exclude.some((re) => re.test(p)))
      .slice(0, site.maxPages)
  } finally {
    await context.close()
  }
}

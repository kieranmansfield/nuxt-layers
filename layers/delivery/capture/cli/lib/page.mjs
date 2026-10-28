// Get a page into a clean, fully loaded state for capture.

const CLEAN_CSS = `
  ::-webkit-scrollbar{display:none}
  nuxt-devtools-frame,#nuxt-devtools-container,[data-nuxt-devtools]{display:none!important}
  #onetrust-consent-sdk,#CybotCookiebotDialog,.cc-window,.cookie-banner,.cookie-notice,.cookie-consent,
  [id*="cookie" i],[class*="cookie" i],[id*="consent" i],[class*="consent" i],[class*="gdpr" i]{display:none!important}
`

// Runs inside the page on every load, repeatedly, so banners that appear late (or after a click) are hidden too.
function hideNotices() {
  const re = /cookie|consent|gdpr/i
  const overlays = new Set(['fixed', 'sticky'])
  // position first: innerText forces layout, so only read it for fixed/sticky elements
  const isNotice = (el) => {
    if (!overlays.has(getComputedStyle(el).position)) return false
    const text = el.innerText || ''
    return text.length < 600 && re.test(text)
  }
  const sweep = () => {
    for (const el of document.querySelectorAll('body *')) {
      if (el.style.display !== 'none' && isNotice(el))
        el.style.setProperty('display', 'none', 'important')
    }
  }
  setInterval(sweep, 300)
}

export const slugOf = (route) =>
  route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replace(/[/?#=&]+/g, '-') || 'home'

/** A fresh context + page for one device x theme, navigated to url and settled. Caller closes ctx. */
export async function openPage(browser, url, { device, theme, scale, settleMs }) {
  const ctx = await browser.newContext({
    viewport: device.viewport,
    deviceScaleFactor: scale,
    isMobile: device.mobile,
    hasTouch: device.mobile,
    colorScheme: theme,
  })
  // Nuxt UI color-mode reads this key; force it so the theme sticks even if the site stored "system".
  await ctx.addInitScript((t) => localStorage.setItem('nuxt-color-mode', t), theme)
  await ctx.addInitScript(hideNotices)
  const page = await ctx.newPage()
  const res = await page.goto(url, { waitUntil: 'load' })
  if (res && res.status() >= 400) {
    await ctx.close()
    throw new Error(`HTTP ${res.status()} for ${url}`)
  }
  await settle(page, settleMs)
  return { ctx, page }
}

// Wait for load, loader, fonts and entrance animations; dismiss notices. Returns when the page is ready to film.
export async function settle(page, settleMs = 2500) {
  await page.waitForLoadState('load')
  // some sites never go network-idle (analytics, video); don't block on it
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
  await page.addStyleTag({ content: CLEAN_CSS })
  // reject = no analytics side effects
  await page
    .getByText(/^(reject|decline|deny|only necessary|necessary only|no thanks)( all)?$/i)
    .first()
    .click({ timeout: 1500 })
    .catch(() => {})
  // Sites on kmcom-nuxt-layers' capture layer say exactly when they're ready; others get heuristics.
  const cooperates = await page.evaluate(() => 'capture' in document.documentElement.dataset)
  const signalled =
    cooperates &&
    (await page
      .waitForFunction(() => document.documentElement.dataset.captureReady === 'true', null, {
        timeout: 20000,
      })
      .then(() => true)
      .catch(() => false))
  if (!signalled) {
    await page
      .locator('#loading-screen')
      .waitFor({ state: 'detached', timeout: 20000 })
      .catch(() => {})
  }
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(settleMs)
}

/** Scroll with real wheel input (so smooth-scroll libraries ease it) until y, or the end. */
export async function wheelTo(page, device, y, { speed = 2500 } = {}) {
  await page.mouse.move(device.viewport.width / 2, device.viewport.height / 2)
  let last = -1
  for (let stuck = 0; stuck < 8;) {
    const [now, max] = await scrollPos(page)
    const target = Math.min(y, max)
    if (Math.abs(target - now) <= 1) break
    await page.mouse.wheel(
      0,
      Math.sign(target - now) * Math.min(Math.abs(target - now), speed / 20)
    )
    await page.waitForTimeout(50)
    stuck = now === last ? stuck + 1 : 0
    last = now
  }
  // let smooth scroll finish easing
  for (let prev = -1, i = 0; i < 40; i++) {
    const [now] = await scrollPos(page)
    if (now === prev) break
    prev = now
    await page.waitForTimeout(100)
  }
}

export const scrollPos = (page) =>
  page.evaluate(() => [Math.round(scrollY), document.documentElement.scrollHeight - innerHeight])

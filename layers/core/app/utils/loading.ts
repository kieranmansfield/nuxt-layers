import type { BootLoading, LoadingConfig } from '../types/loading'

/** Fallbacks for keys app.config leaves unset - core's app.config ships the same values. */
const LOADING_DEFAULTS: LoadingConfig = {
  enabled: true,
  minDuration: 0,
  maxDuration: 10000,
  showAfter: 400,
  label: 'Loading',
  background: '#0a0a0a',
  textColor: '#ffffff',
  zIndex: 10000,
}

/** Reads `coreLayer.loading` from app config, filling unset keys with the defaults. */
export function resolveLoadingConfig(coreLayer: unknown): LoadingConfig {
  const loading = (coreLayer as { loading?: Partial<LoadingConfig> } | undefined)?.loading
  return { ...LOADING_DEFAULTS, ...loading }
}

/*
 * Pure easing math behind the progress counter. The target only moves at real milestones;
 * `approachProgress` runs once per animation frame to move the displayed value toward it, so the
 * counter climbs smoothly instead of jumping.
 */

/**
 * Advances `current` toward `target` over `dt` seconds. Eases out as the gap closes, within a
 * speed band, and never moves backwards or past `target`. A rAF timestamp can precede the
 * `performance.now()` the loop started from, so `dt <= 0` is a no-op rather than a step back.
 *
 * Self-contained (constants inside, no outer references): `bootLoading` receives it as source
 * text in the page.
 */
export function approachProgress(current: number, target: number, dt: number): number {
  // Time constant (s) of the exponential ease, and the speed band (%/s): no crawling at the
  // tail, no leaps on big jumps
  const EASE = 0.15
  const MIN_SPEED = 24
  const MAX_SPEED = 140
  const gap = target - current
  if (gap <= 0 || dt <= 0) return current
  const eased = gap * (1 - Math.exp(-dt / EASE))
  const step = Math.min(Math.max(eased, MIN_SPEED * dt), MAX_SPEED * dt)
  return Math.min(current + step, target)
}

type BootConfig = Pick<LoadingConfig, 'minDuration' | 'maxDuration' | 'showAfter'>

/** The inline `<script>` body that starts `bootLoading` in the page. */
export function bootScript(config: BootConfig): string {
  const { minDuration, maxDuration, showAfter } = config
  const json = JSON.stringify({ minDuration, maxDuration, showAfter })
  return `(${String(bootLoading)})(window,${String(approachProgress)},${json})`
}

/**
 * The boot screen's progress runtime. `LoadingScreen` inlines its source at the end of `<body>`,
 * so it counts from the first paint, long before Vue has downloaded on a slow connection.
 *
 * Progress is real: the share of the document's up-front subresources (scripts, stylesheets,
 * preloads, non-lazy images) that have arrived, plus a step once the app has mounted. It completes
 * when the page has loaded, the app has mounted and fonts are ready - or at `maxDuration`, once
 * mounted - and never before `minDuration`. Between milestones the count creeps, so a stall on
 * one big image reads as slow, not frozen.
 *
 * Work done before `showAfter` skips the count: it was never shown. Otherwise the counter fades in
 * and always counts up to 100 before `done`.
 *
 * It writes the count straight to the DOM - nodes Vue renders empty or leaves unbound - so it
 * never causes a hydration mismatch, and publishes its state as `window.__coreLoading`.
 *
 * Self-contained: it runs from its own source text, so no imports or outer references - and every
 * browser global goes through `win`, because Nuxt's server build rewrites bare `window` and
 * `document` to `undefined` in the source it serialises.
 */
export function bootLoading(
  win: typeof window,
  approach: typeof approachProgress,
  config: BootConfig
): void {
  const doc = win.document
  const screen = doc.getElementById('loading-screen')
  if (win.__coreLoading || !screen) return

  // Share of the count each part earns; the last 1% is only given on completion
  const ASSETS = 85
  const MOUNTED = 14
  // Rate (/s) the count creeps toward 99 while it waits on a milestone
  const CREEP = 0.04

  const meter = screen.querySelector('[data-loading-meter]')
  const count = screen.querySelector('[data-loading-count]')
  const bar = screen.querySelector<HTMLElement>('[data-loading-bar]')
  const listeners: Array<(progress: number, done: boolean) => void> = []

  const urls = new Set<string>()
  const selector =
    'script[src], link[rel="stylesheet"][href], link[rel="modulepreload"][href], link[rel="preload"][href]'
  for (const el of doc.querySelectorAll<HTMLScriptElement | HTMLLinkElement>(selector)) {
    urls.add('src' in el ? el.src : el.href)
  }
  const images = Array.from(doc.querySelectorAll<HTMLImageElement>('img:not([loading="lazy"])'))
  const arrived = new Set<string>()
  try {
    new win.PerformanceObserver((list) => {
      for (const entry of list.getEntries()) arrived.add(entry.name)
    }).observe({ type: 'resource', buffered: true })
  } catch {
    // No Resource Timing: assets count as arrived on window load
  }

  let mounted = false
  let pageLoaded = doc.readyState === 'complete'
  if (!pageLoaded) win.addEventListener('load', () => (pageLoaded = true), { once: true })

  const state: BootLoading = {
    progress: 0,
    shown: false,
    skipped: false,
    done: false,
    listen(fn) {
      listeners.push(fn)
      if (state.done) fn(state.progress, true)
    },
    mounted() {
      mounted = true
    },
    finish() {
      if (state.done) return
      state.skipped = true
      end()
    },
  }
  win.__coreLoading = state

  let target = 0
  // The screen's first paint - `showAfter` counts from here, not navigation start, so a slow
  // server response doesn't use up the grace a fast page load gets
  const start = win.performance.now()
  let last = start
  let frame = 0
  let written = -1

  function render(): void {
    const value = Math.floor(state.progress)
    if (value !== written) {
      written = value
      if (count) count.textContent = String(value)
      meter?.setAttribute('aria-valuenow', String(value))
    }
    if (bar) bar.style.transform = `scaleX(${state.progress / 100})`
  }

  function end(): void {
    win.cancelAnimationFrame(frame)
    state.progress = 100
    state.done = true
    render()
    for (const fn of listeners) fn(100, true)
  }

  function isComplete(now: number): boolean {
    if (!mounted || now < config.minDuration) return false
    return (pageLoaded && doc.fonts?.status !== 'loading') || now >= config.maxDuration
  }

  /** Share (0-1) of the up-front subresources that have arrived. */
  function assetShare(): number {
    const total = urls.size + images.length
    if (pageLoaded || !total) return 1
    let arrivedCount = images.filter((img) => img.complete).length
    for (const url of urls) if (arrived.has(url)) arrivedCount++
    return arrivedCount / total
  }

  function reveal(now: number): void {
    if (state.shown || now - start < config.showAfter) return
    state.shown = true
    screen?.setAttribute('data-shown', '')
  }

  function nextProgress(dt: number, complete: boolean): number {
    // Finishing counts at double speed: the work is done, so don't make anyone wait on the number
    if (complete) return approach(state.progress, 100, dt * 2)
    const creep = state.progress + (99 - state.progress) * (1 - Math.exp(-dt * CREEP))
    return Math.max(approach(state.progress, target, dt), creep)
  }

  function tick(now: number): void {
    // Cap at one 30fps frame so a main-thread hitch (hydration, a backgrounded tab) is followed by
    // a quick count, not a leap
    const dt = Math.min(Math.max(now - last, 0) / 1000, 1 / 30)
    last = now

    const complete = isComplete(now)
    target = Math.max(target, Math.min(99, assetShare() * ASSETS + (mounted ? MOUNTED : 0)))
    if (complete && !state.shown) return end()

    reveal(now)
    state.progress = nextProgress(dt, complete)
    if (state.progress >= 100) return end()

    render()
    for (const fn of listeners) fn(state.progress, false)
    frame = win.requestAnimationFrame(tick)
  }

  // No screen under reduced motion (CSS hides it), so nothing to count
  if (win.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return state.finish()
  render()
  frame = win.requestAnimationFrame(tick)
}

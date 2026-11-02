// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import type { BootLoading } from '../types/loading'
import { approachProgress, bootLoading, bootScript } from './loading'

const FRAME = 1000 / 60
const config = { minDuration: 0, maxDuration: 10000, showAfter: 400 }

// Fake clock and the one pending animation frame
const clock: { now: number; pending: FrameRequestCallback | undefined } = {
  now: 0,
  pending: undefined,
}

/** The runtime's published state - throws if it never started. */
function loading(): BootLoading {
  const state = window.__coreLoading
  if (!state) throw new Error('boot runtime did not start')
  return state
}

function el(selector: string): Element {
  const found = document.querySelector(selector)
  if (!found) throw new Error(`missing ${selector}`)
  return found
}

/** Runs frames until `until` (ms) or the loop stops, returning the progress seen each frame. */
function runTo(until: number): number[] {
  const seen: number[] = []
  while (clock.pending && clock.now < until) {
    clock.now += FRAME
    const frame = clock.pending
    clock.pending = undefined
    frame(clock.now)
    seen.push(loading().progress)
  }
  return seen
}

/** Starts the runtime from the exact source the page inlines - proving it's self-contained. */
function boot(): void {
  new Function(bootScript(config))()
}

function setLoaded(loaded: boolean): void {
  Object.defineProperty(document, 'readyState', {
    value: loaded ? 'complete' : 'loading',
    configurable: true,
  })
  if (loaded) window.dispatchEvent(new Event('load'))
}

const mount = () => loading().mounted()
const shown = () => el('#loading-screen').hasAttribute('data-shown')

beforeEach(() => {
  clock.now = 0
  clock.pending = undefined
  vi.spyOn(performance, 'now').mockImplementation(() => clock.now)
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    clock.pending = cb
    return 1
  })
  vi.stubGlobal('cancelAnimationFrame', () => (clock.pending = undefined))
  delete window.__coreLoading
  document.body.innerHTML = `
    <link rel="modulepreload" href="/_nuxt/entry.js">
    <link rel="modulepreload" href="/_nuxt/page.js">
    <div id="app">
      <div id="loading-screen">
        <div data-loading-meter><span data-loading-count></span></div>
        <div data-loading-bar></div>
      </div>
    </div>`
  setLoaded(false)
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('bootLoading', () => {
  it('skips the count when the work is done before the counter shows', () => {
    boot()
    mount()
    setLoaded(true)
    runTo(1000)
    expect(loading()).toMatchObject({ done: true, shown: false, skipped: false, progress: 100 })
    expect(shown()).toBe(false)
  })

  it('times showAfter from first paint, so a slow server response leaves no count to sit through', () => {
    clock.now = 900
    boot()
    runTo(1100)
    mount()
    setLoaded(true)
    runTo(2000)
    expect(window.__coreLoading).toMatchObject({ done: true, shown: false })
  })

  it('holds below 100 on a slow load, then counts up to it - never jumping or going back', () => {
    boot()
    const waiting = runTo(5000)
    const state = loading()
    expect(state.shown).toBe(true)
    expect(shown()).toBe(true)
    expect(state.done).toBe(false)
    // Creeps while waiting, but nowhere near done
    expect(state.progress).toBeGreaterThan(0)
    expect(state.progress).toBeLessThan(30)

    const done = vi.fn()
    state.listen(done)
    mount()
    setLoaded(true)
    const finishing = runTo(10000)
    expect(finishing.length).toBeGreaterThan(5)
    expect(finishing[0]).toBeLessThan(100)

    const all = [...waiting, ...finishing]
    all.reduce((previous, value) => {
      expect(value).toBeGreaterThanOrEqual(previous)
      return value
    })
    expect(state.done).toBe(true)
    expect(el('[data-loading-count]').textContent).toBe('100')
    expect(done).toHaveBeenLastCalledWith(100, true)
  })

  it('finishes at maxDuration once mounted, even if the page never loads', () => {
    boot()
    mount()
    runTo(config.maxDuration - FRAME)
    expect(loading().done).toBe(false)
    runTo(config.maxDuration + 2000)
    expect(loading().done).toBe(true)
  })

  it('never completes before the app has mounted', () => {
    boot()
    setLoaded(true)
    runTo(config.maxDuration + 2000)
    expect(loading().done).toBe(false)
    expect(loading().progress).toBeLessThan(100)
  })

  it('finish() ends at once as skipped, and late listeners still hear it', () => {
    boot()
    loading().finish()
    const late = vi.fn()
    loading().listen(late)
    expect(window.__coreLoading).toMatchObject({ done: true, skipped: true })
    expect(late).toHaveBeenCalledWith(100, true)
    expect(clock.pending).toBeUndefined()
  })

  it('reaches browser globals only through win - the server build rewrites bare ones', () => {
    // Nuxt's server `define` turns these into `undefined` in the serialised source
    const bare = /(?<![.\w])(window|document|navigator|location|XMLHttpRequest)\b/
    expect(String(bootLoading)).not.toMatch(bare)
    expect(String(approachProgress)).not.toMatch(bare)
  })

  it('runs once, however often the script is inlined', () => {
    boot()
    const first = window.__coreLoading
    boot()
    expect(window.__coreLoading).toBe(first)
  })
})

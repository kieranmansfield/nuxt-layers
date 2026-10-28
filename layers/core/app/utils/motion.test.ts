import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vite-plus/test'

import { DURATION_MS } from '../types/tokens'
import { resolveDurationMs, resolveEaseCss } from './motion'

describe('resolveDurationMs', () => {
  it('passes milliseconds through', () => {
    expect(resolveDurationMs(240)).toBe(240)
  })

  it('resolves tokens to their millisecond value', () => {
    expect(resolveDurationMs('fast')).toBe(150)
  })

  // DURATION_MS hand-mirrors the CSS tokens; catch the two drifting apart
  it('matches the --duration-token-* values in elevation-motion.css', () => {
    const css = readFileSync(
      new URL('../assets/css/tokens/elevation-motion.css', import.meta.url),
      'utf8'
    )
    for (const [name, ms] of Object.entries(DURATION_MS)) {
      expect(css).toMatch(new RegExp(`--duration-token-${name}:\\s*${ms}ms`))
    }
  })
})

describe('resolveEaseCss', () => {
  it('maps tokens to their custom property', () => {
    expect(resolveEaseCss('emphasized')).toBe('var(--ease-emphasized)')
    expect(resolveEaseCss('out')).toBe('var(--ease-out)')
  })

  it('passes raw CSS easing through', () => {
    expect(resolveEaseCss('cubic-bezier(0, 0, 1, 1)')).toBe('cubic-bezier(0, 0, 1, 1)')
  })
})

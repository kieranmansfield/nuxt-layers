import { describe, expect, it } from 'vitest'

import { getBrowserVersionParts, isBrowserAtLeast, parseBrowserInfo } from './browserInfo'

describe('parseBrowserInfo', () => {
  // In a node vitest environment `import.meta.client` is not defined by Nuxt's
  // build macros, so it is falsy and the function always takes its SSR/default
  // branch regardless of the user agent passed in.
  it('returns the unknown/default shape when import.meta.client is falsy', () => {
    expect(parseBrowserInfo('Mozilla/5.0 Chrome/120.0.0.0')).toEqual({
      name: 'unknown',
      version: '0',
      engine: 'unknown',
      os: 'unknown',
    })
  })

  it('returns the same default shape with no user agent argument', () => {
    expect(parseBrowserInfo()).toEqual({
      name: 'unknown',
      version: '0',
      engine: 'unknown',
      os: 'unknown',
    })
  })

  it('returns the same default shape with a null user agent', () => {
    expect(parseBrowserInfo(null)).toEqual({
      name: 'unknown',
      version: '0',
      engine: 'unknown',
      os: 'unknown',
    })
  })
})

describe('getBrowserVersionParts', () => {
  it('parses a major.minor version string', () => {
    expect(getBrowserVersionParts('120.5')).toEqual({ major: 120, minor: 5 })
  })

  it('defaults minor to 0 when only a major version is given', () => {
    expect(getBrowserVersionParts('120')).toEqual({ major: 120, minor: 0 })
  })

  it('defaults both parts to 0 for a non-numeric version', () => {
    expect(getBrowserVersionParts('abc')).toEqual({ major: 0, minor: 0 })
  })

  it('defaults both parts to 0 for an empty string', () => {
    expect(getBrowserVersionParts('')).toEqual({ major: 0, minor: 0 })
  })

  it('parses extra version segments, ignoring anything past minor', () => {
    expect(getBrowserVersionParts('120.5.9.1')).toEqual({ major: 120, minor: 5 })
  })
})

describe('isBrowserAtLeast', () => {
  it('returns false when the minimum version has no major segment', () => {
    expect(isBrowserAtLeast('120.0', '')).toBe(false)
  })

  it('returns true when the current major exceeds the required major', () => {
    expect(isBrowserAtLeast('121.0', '120.5')).toBe(true)
  })

  it('returns false when the current major is behind the required major', () => {
    expect(isBrowserAtLeast('119.9', '120.0')).toBe(false)
  })

  it('compares minor versions when majors are equal', () => {
    expect(isBrowserAtLeast('120.5', '120.5')).toBe(true)
    expect(isBrowserAtLeast('120.6', '120.5')).toBe(true)
    expect(isBrowserAtLeast('120.4', '120.5')).toBe(false)
  })

  it('treats a missing minimum minor as 0', () => {
    expect(isBrowserAtLeast('120.0', '120')).toBe(true)
  })
})

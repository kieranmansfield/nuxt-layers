import { describe, expect, it } from 'vitest'

import { splitSpaces } from './regex'

describe('splitSpaces', () => {
  it('splits a sentence on single whitespace characters', () => {
    expect(splitSpaces('Nuxt Layers rocks')).toEqual(['Nuxt', 'Layers', 'rocks'])
  })

  it('splits on the first whitespace match only per gap (non-global regex)', () => {
    // The source regex has no /g flag, so String#split still splits on every
    // occurrence (split applies the pattern repeatedly regardless of /g).
    expect(splitSpaces('a  b')).toEqual(['a', '', 'b'])
  })

  it('returns a single-element array for text with no spaces', () => {
    expect(splitSpaces('single')).toEqual(['single'])
  })

  it('returns two empty strings for a single space', () => {
    expect(splitSpaces(' ')).toEqual(['', ''])
  })

  it('returns an array with one empty string for an empty string', () => {
    expect(splitSpaces('')).toEqual([''])
  })

  it('splits on tabs and newlines as whitespace', () => {
    expect(splitSpaces('a\tb\nc')).toEqual(['a', 'b', 'c'])
  })
})

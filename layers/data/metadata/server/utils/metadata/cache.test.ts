import { describe, expect, it } from 'vitest'

import { hashQuery, makeCacheKey } from './cache'

describe('makeCacheKey', () => {
  it('joins parts with ":"', () => {
    expect(makeCacheKey('metadata', 'comicvine', 'issue', '1000')).toBe(
      'metadata:comicvine:issue:1000'
    )
  })

  it('handles a single part', () => {
    expect(makeCacheKey('metadata')).toBe('metadata')
  })

  it('handles no parts', () => {
    expect(makeCacheKey()).toBe('')
  })
})

describe('hashQuery', () => {
  it('is deterministic for the same input', () => {
    expect(hashQuery('watchmen')).toBe(hashQuery('watchmen'))
  })

  it('differs for different inputs', () => {
    expect(hashQuery('watchmen')).not.toBe(hashQuery('v for vendetta'))
  })

  it('handles an empty string', () => {
    expect(hashQuery('')).toBe('0')
  })

  it('returns a non-negative base36 string', () => {
    const hash = hashQuery('some query with lots of characters to hash')
    expect(hash).toEqual(expect.any(String))
    expect(hash.startsWith('-')).toBe(false)
  })
})

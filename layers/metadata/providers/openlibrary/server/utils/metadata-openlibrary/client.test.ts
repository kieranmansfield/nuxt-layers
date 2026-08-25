import { describe, expect, it } from 'vitest'

import { openLibraryCoverUrl } from './client'

describe('openLibraryCoverUrl', () => {
  it('builds the covers.openlibrary.org URL shape', () => {
    expect(openLibraryCoverUrl(12345)).toBe('https://covers.openlibrary.org/b/id/12345-L.jpg')
  })

  it('defaults to size L when no size is given', () => {
    expect(openLibraryCoverUrl(1)).toBe('https://covers.openlibrary.org/b/id/1-L.jpg')
  })

  it('supports the S size', () => {
    expect(openLibraryCoverUrl(1, 'S')).toBe('https://covers.openlibrary.org/b/id/1-S.jpg')
  })

  it('supports the M size', () => {
    expect(openLibraryCoverUrl(1, 'M')).toBe('https://covers.openlibrary.org/b/id/1-M.jpg')
  })

  it('supports the L size explicitly', () => {
    expect(openLibraryCoverUrl(1, 'L')).toBe('https://covers.openlibrary.org/b/id/1-L.jpg')
  })
})

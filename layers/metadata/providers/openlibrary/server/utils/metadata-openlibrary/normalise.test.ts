import { describe, expect, it, vi } from 'vitest'

import { openLibraryCoverUrl } from './client'
import {
  normaliseOpenLibraryEdition,
  normaliseOpenLibrarySearchDoc,
  normaliseOpenLibraryWork,
} from './normalise'
import type { OpenLibraryEdition, OpenLibrarySearchDoc, OpenLibraryWork } from './types'

// normalise.ts calls openLibraryCoverUrl() as a Nitro auto-import; stub it with the real
// implementation from client.ts since that function is pure (no $fetch/config involved).
vi.stubGlobal('openLibraryCoverUrl', openLibraryCoverUrl)

function baseSearchDoc(overrides: Partial<OpenLibrarySearchDoc> = {}): OpenLibrarySearchDoc {
  return {
    key: '/works/OL82563W',
    title: 'Watchmen',
    ...overrides,
  }
}

function baseWork(overrides: Partial<OpenLibraryWork> = {}): OpenLibraryWork {
  return {
    key: '/works/OL82563W',
    title: 'Watchmen',
    ...overrides,
  }
}

function baseEdition(overrides: Partial<OpenLibraryEdition> = {}): OpenLibraryEdition {
  return {
    key: '/books/OL456M',
    title: 'Watchmen',
    ...overrides,
  }
}

describe('normaliseOpenLibrarySearchDoc', () => {
  it('strips /works/ from the key to derive the id', () => {
    const record = normaliseOpenLibrarySearchDoc(baseSearchDoc({ key: '/works/OL82563W' }))
    expect(record.providerId).toBe('OL82563W')
    expect(record.id).toBe('openlibrary:work:OL82563W')
  })

  it('splits isbn[] into isbn10/isbn13 by length', () => {
    const record = normaliseOpenLibrarySearchDoc(
      baseSearchDoc({ isbn: ['0930289232', '9780930289232'] })
    )
    expect(record.identifiers).toMatchObject({ isbn10: '0930289232', isbn13: '9780930289232' })
  })

  it('leaves isbn10/isbn13 undefined when isbn is absent', () => {
    const record = normaliseOpenLibrarySearchDoc(baseSearchDoc())
    expect(record.identifiers?.isbn10).toBeUndefined()
    expect(record.identifiers?.isbn13).toBeUndefined()
  })

  it('maps author_name/author_key pairs into creators, stripping /authors/', () => {
    const record = normaliseOpenLibrarySearchDoc(
      baseSearchDoc({ author_name: ['Alan Moore'], author_key: ['/authors/OL123A'] })
    )
    expect(record.creators).toEqual([{ name: 'Alan Moore', role: 'author', providerId: 'OL123A' }])
  })

  it('leaves creators undefined when there are no authors', () => {
    expect(normaliseOpenLibrarySearchDoc(baseSearchDoc()).creators).toBeUndefined()
  })

  it('builds coverUrl from cover_i using openLibraryCoverUrl', () => {
    const record = normaliseOpenLibrarySearchDoc(baseSearchDoc({ cover_i: 12345 }))
    expect(record.coverUrl).toBe(openLibraryCoverUrl(12345))
  })

  it('leaves coverUrl undefined when cover_i is absent', () => {
    expect(normaliseOpenLibrarySearchDoc(baseSearchDoc()).coverUrl).toBeUndefined()
  })

  it('stamps lastSyncedAt as a string', () => {
    expect(normaliseOpenLibrarySearchDoc(baseSearchDoc()).lastSyncedAt).toEqual(expect.any(String))
  })
})

describe('normaliseOpenLibraryWork', () => {
  it('strips /works/ from the key to derive the id', () => {
    const record = normaliseOpenLibraryWork(baseWork({ key: '/works/OL82563W' }))
    expect(record.providerId).toBe('OL82563W')
    expect(record.id).toBe('openlibrary:work:OL82563W')
  })

  it('uses the description string directly when it is a string', () => {
    const record = normaliseOpenLibraryWork(baseWork({ description: 'Plain text description' }))
    expect(record.description).toBe('Plain text description')
  })

  it('extracts description.value when description is an object', () => {
    const record = normaliseOpenLibraryWork(
      baseWork({ description: { value: 'Wrapped description' } })
    )
    expect(record.description).toBe('Wrapped description')
  })

  it('leaves description undefined when absent', () => {
    expect(normaliseOpenLibraryWork(baseWork()).description).toBeUndefined()
  })

  it('builds coverUrl from covers[0]', () => {
    const record = normaliseOpenLibraryWork(baseWork({ covers: [777, 888] }))
    expect(record.coverUrl).toBe(openLibraryCoverUrl(777))
  })
})

describe('normaliseOpenLibraryEdition', () => {
  it('strips /books/ from the key to derive the id', () => {
    const record = normaliseOpenLibraryEdition(baseEdition({ key: '/books/OL456M' }))
    expect(record.providerId).toBe('OL456M')
    expect(record.id).toBe('openlibrary:edition:OL456M')
  })

  it('reads isbn10/isbn13 from the first entries of isbn_10/isbn_13', () => {
    const record = normaliseOpenLibraryEdition(
      baseEdition({ isbn_10: ['0930289232'], isbn_13: ['9780930289232', '9999999999999'] })
    )
    expect(record.identifiers).toMatchObject({ isbn10: '0930289232', isbn13: '9780930289232' })
  })

  it('leaves isbn10/isbn13 undefined when absent', () => {
    const record = normaliseOpenLibraryEdition(baseEdition())
    expect(record.identifiers?.isbn10).toBeUndefined()
    expect(record.identifiers?.isbn13).toBeUndefined()
  })

  it('builds coverUrl from covers[0]', () => {
    const record = normaliseOpenLibraryEdition(baseEdition({ covers: [111] }))
    expect(record.coverUrl).toBe(openLibraryCoverUrl(111))
  })

  it('takes publisher from publishers[0]', () => {
    const record = normaliseOpenLibraryEdition(baseEdition({ publishers: ['DC Comics', 'Vertigo'] }))
    expect(record.publisher).toBe('DC Comics')
  })
})

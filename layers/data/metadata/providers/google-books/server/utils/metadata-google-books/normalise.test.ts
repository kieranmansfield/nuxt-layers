import { describe, expect, it, vi } from 'vitest'

import { googleBooksCoverUrl, googleBooksMediaType } from './client'
import { normaliseGoogleBooksVolume } from './normalise'
import type { GoogleBooksVolume } from './types'

// normalise.ts calls googleBooksMediaType()/googleBooksCoverUrl() as Nitro auto-imports;
// stub them with the real (pure, string-building) implementations from client.ts.
vi.stubGlobal('googleBooksMediaType', googleBooksMediaType)
vi.stubGlobal('googleBooksCoverUrl', googleBooksCoverUrl)

function baseVolume(overrides: Partial<GoogleBooksVolume['volumeInfo']> = {}): GoogleBooksVolume {
  return {
    id: 'abc123',
    selfLink: 'https://www.googleapis.com/books/v1/volumes/abc123',
    volumeInfo: {
      title: 'Watchmen',
      ...overrides,
    },
  }
}

describe('normaliseGoogleBooksVolume', () => {
  it('prefers extraLarge over all other image sizes', () => {
    const record = normaliseGoogleBooksVolume(
      baseVolume({
        imageLinks: {
          smallThumbnail: 's.jpg',
          thumbnail: 't.jpg',
          small: 'sm.jpg',
          medium: 'm.jpg',
          large: 'l.jpg',
          extraLarge: 'xl.jpg',
        },
      })
    )
    expect(record.coverUrl).toBe(googleBooksCoverUrl('xl.jpg'))
  })

  it('falls back to large when extraLarge is absent', () => {
    const record = normaliseGoogleBooksVolume(
      baseVolume({ imageLinks: { large: 'l.jpg', medium: 'm.jpg' } })
    )
    expect(record.coverUrl).toBe(googleBooksCoverUrl('l.jpg'))
  })

  it('falls back to medium when extraLarge/large are absent', () => {
    const record = normaliseGoogleBooksVolume(
      baseVolume({ imageLinks: { medium: 'm.jpg', small: 'sm.jpg' } })
    )
    expect(record.coverUrl).toBe(googleBooksCoverUrl('m.jpg'))
  })

  it('falls back to small when extraLarge/large/medium are absent', () => {
    const record = normaliseGoogleBooksVolume(
      baseVolume({ imageLinks: { small: 'sm.jpg', thumbnail: 't.jpg' } })
    )
    expect(record.coverUrl).toBe(googleBooksCoverUrl('sm.jpg'))
  })

  it('falls back to thumbnail when larger sizes are absent', () => {
    const record = normaliseGoogleBooksVolume(
      baseVolume({ imageLinks: { thumbnail: 't.jpg', smallThumbnail: 's.jpg' } })
    )
    expect(record.coverUrl).toBe(googleBooksCoverUrl('t.jpg'))
  })

  it('falls back to smallThumbnail as the last resort', () => {
    const record = normaliseGoogleBooksVolume(
      baseVolume({ imageLinks: { smallThumbnail: 's.jpg' } })
    )
    expect(record.coverUrl).toBe(googleBooksCoverUrl('s.jpg'))
  })

  it('leaves coverUrl undefined when imageLinks is absent', () => {
    expect(normaliseGoogleBooksVolume(baseVolume()).coverUrl).toBeUndefined()
  })

  it('extracts isbn10/isbn13 from industryIdentifiers', () => {
    const record = normaliseGoogleBooksVolume(
      baseVolume({
        industryIdentifiers: [
          { type: 'ISBN_10', identifier: '0930289232' },
          { type: 'ISBN_13', identifier: '9780930289232' },
        ],
      })
    )
    expect(record.identifiers).toMatchObject({
      isbn10: '0930289232',
      isbn13: '9780930289232',
    })
  })

  it('leaves isbn10/isbn13 undefined when industryIdentifiers is absent', () => {
    const record = normaliseGoogleBooksVolume(baseVolume())
    expect(record.identifiers?.isbn10).toBeUndefined()
    expect(record.identifiers?.isbn13).toBeUndefined()
  })

  it('always sets identifiers.googleBooksId to the volume id', () => {
    const record = normaliseGoogleBooksVolume(baseVolume())
    expect(record.identifiers?.googleBooksId).toBe('abc123')
  })

  it('classifies mediaType via googleBooksMediaType(categories)', () => {
    const manga = normaliseGoogleBooksVolume(baseVolume({ categories: ['Manga'] }))
    expect(manga.mediaType).toBe('manga')

    const book = normaliseGoogleBooksVolume(baseVolume({ categories: ['Fiction'] }))
    expect(book.mediaType).toBe('book')
  })

  it('maps authors to creators with the author role', () => {
    const record = normaliseGoogleBooksVolume(baseVolume({ authors: ['Alan Moore'] }))
    expect(record.creators).toEqual([{ name: 'Alan Moore', role: 'author' }])
  })

  it('leaves creators undefined when authors is absent', () => {
    expect(normaliseGoogleBooksVolume(baseVolume()).creators).toBeUndefined()
  })

  it('prefers canonicalVolumeLink over infoLink for sourceUrl', () => {
    const record = normaliseGoogleBooksVolume(
      baseVolume({ canonicalVolumeLink: 'canonical.url', infoLink: 'info.url' })
    )
    expect(record.sourceUrl).toBe('canonical.url')
  })

  it('falls back to infoLink when canonicalVolumeLink is absent', () => {
    const record = normaliseGoogleBooksVolume(baseVolume({ infoLink: 'info.url' }))
    expect(record.sourceUrl).toBe('info.url')
  })

  it('stamps lastSyncedAt as a string', () => {
    expect(normaliseGoogleBooksVolume(baseVolume()).lastSyncedAt).toEqual(expect.any(String))
  })

  it('sets id and provider fields from the volume id', () => {
    const record = normaliseGoogleBooksVolume(baseVolume())
    expect(record.id).toBe('google-books:volume:abc123')
    expect(record.provider).toBe('google-books')
    expect(record.providerId).toBe('abc123')
  })
})

import { describe, expect, it, vi } from 'vitest'

vi.stubGlobal('useRuntimeConfig', () => ({
  metadataTmdb: {
    apiKey: 'test-key',
    baseUrl: 'https://api.themoviedb.org/3',
    imageBaseUrl: 'https://image.tmdb.org/t/p',
  },
}))

const { tmdbImageUrl } = await import('./client')

describe('tmdbImageUrl', () => {
  it('returns undefined when path is null', () => {
    expect(tmdbImageUrl(null)).toBeUndefined()
  })

  it('defaults size to w500', () => {
    expect(tmdbImageUrl('/poster.jpg')).toBe('https://image.tmdb.org/t/p/w500/poster.jpg')
  })

  it('uses a custom size when provided', () => {
    expect(tmdbImageUrl('/poster.jpg', 'w200')).toBe('https://image.tmdb.org/t/p/w200/poster.jpg')
  })

  it('prefixes imageBaseUrl from runtime config', () => {
    expect(tmdbImageUrl('/backdrop.jpg')).toBe(
      'https://image.tmdb.org/t/p/w500/backdrop.jpg'
    )
  })
})

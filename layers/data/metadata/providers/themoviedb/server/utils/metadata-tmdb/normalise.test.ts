import { describe, expect, it, vi } from 'vitest'

import { tmdbImageUrl } from './client'
import { normaliseTmdbMovie, normaliseTmdbSearchResult, normaliseTmdbTV } from './normalise'
import type { TMDBMovie, TMDBSearchMultiResult, TMDBTVShow } from './types'

// normalise.ts calls tmdbImageUrl() and getConfig() -> useRuntimeConfig() as Nitro auto-imports;
// stub the runtime config and delegate to the real (pure, string-building) client implementation.
vi.stubGlobal('useRuntimeConfig', () => ({
  metadataTmdb: {
    apiKey: 'test-key',
    baseUrl: 'https://api.themoviedb.org/3',
    imageBaseUrl: 'https://image.tmdb.org/t/p',
  },
}))
vi.stubGlobal('tmdbImageUrl', tmdbImageUrl)

function baseMovie(overrides: Partial<TMDBMovie> = {}): TMDBMovie {
  return {
    id: 550,
    title: 'Fight Club',
    overview: '',
    poster_path: null,
    backdrop_path: null,
    release_date: '',
    ...overrides,
  }
}

function baseTV(overrides: Partial<TMDBTVShow> = {}): TMDBTVShow {
  return {
    id: 1399,
    name: 'Game of Thrones',
    overview: '',
    poster_path: null,
    backdrop_path: null,
    first_air_date: '',
    ...overrides,
  }
}

function baseSearchResult(overrides: Partial<TMDBSearchMultiResult> = {}): TMDBSearchMultiResult {
  return {
    id: 1,
    media_type: 'movie',
    poster_path: null,
    ...overrides,
  }
}

describe('normaliseTmdbMovie', () => {
  it('filters directors from credits.crew by job === "Director"', () => {
    const record = normaliseTmdbMovie(
      baseMovie({
        credits: {
          cast: [],
          crew: [
            { id: 1, name: 'David Fincher', job: 'Director', department: 'Directing' },
            { id: 2, name: 'Jim Uhls', job: 'Screenplay', department: 'Writing' },
          ],
        },
      })
    )
    expect(record.creators).toEqual([{ name: 'David Fincher', role: 'Director', providerId: '1' }])
  })

  it('omits creators entirely when there are no directors', () => {
    const record = normaliseTmdbMovie(baseMovie())
    expect('creators' in record).toBe(false)
  })

  it('omits description, publisher, publishedAt and coverUrl when source fields are absent', () => {
    const record = normaliseTmdbMovie(baseMovie())
    expect('description' in record).toBe(false)
    expect('publisher' in record).toBe(false)
    expect('publishedAt' in record).toBe(false)
    expect('coverUrl' in record).toBe(false)
  })

  it('includes description, publisher, publishedAt and coverUrl when source fields are present', () => {
    const record = normaliseTmdbMovie(
      baseMovie({
        overview: 'A depressed man forms an underground fight club.',
        production_companies: [{ id: 1, name: 'Fox 2000 Pictures' }],
        release_date: '1999-10-15',
        poster_path: '/poster.jpg',
      })
    )
    expect(record.description).toBe('A depressed man forms an underground fight club.')
    expect(record.publisher).toBe('Fox 2000 Pictures')
    expect(record.publishedAt).toBe('1999-10-15')
    expect(record.coverUrl).toBe('https://image.tmdb.org/t/p/w500/poster.jpg')
  })

  it('includes imdbId in identifiers only when external_ids.imdb_id is present', () => {
    const withImdb = normaliseTmdbMovie(baseMovie({ external_ids: { imdb_id: 'tt0137523' } }))
    expect(withImdb.identifiers).toEqual({ tmdbId: '550', imdbId: 'tt0137523' })

    const withoutImdb = normaliseTmdbMovie(baseMovie())
    expect(withoutImdb.identifiers).toEqual({ tmdbId: '550' })
    expect('imdbId' in (withoutImdb.identifiers as object)).toBe(false)
  })

  it('stamps lastSyncedAt as a string', () => {
    expect(normaliseTmdbMovie(baseMovie()).lastSyncedAt).toEqual(expect.any(String))
  })
})

describe('normaliseTmdbTV', () => {
  it('maps created_by to Creator-role creators', () => {
    const record = normaliseTmdbTV(baseTV({ created_by: [{ id: 9, name: 'David Benioff' }] }))
    expect(record.creators).toEqual([{ name: 'David Benioff', role: 'Creator', providerId: '9' }])
  })

  it('omits creators when created_by is absent', () => {
    const record = normaliseTmdbTV(baseTV())
    expect('creators' in record).toBe(false)
  })

  it('takes publisher from the first network', () => {
    const record = normaliseTmdbTV(baseTV({ networks: [{ id: 1, name: 'HBO' }] }))
    expect(record.publisher).toBe('HBO')
  })

  it('includes imdbId in identifiers only when external_ids.imdb_id is present', () => {
    const record = normaliseTmdbTV(baseTV({ external_ids: { imdb_id: 'tt0944947' } }))
    expect(record.identifiers).toEqual({ tmdbId: '1399', imdbId: 'tt0944947' })
  })
})

describe('normaliseTmdbSearchResult', () => {
  it('uses title/release_date and the movie url path for movie results', () => {
    const record = normaliseTmdbSearchResult(
      baseSearchResult({ media_type: 'movie', title: 'Dune', release_date: '2021-10-22' })
    )
    expect(record.title).toBe('Dune')
    expect(record.mediaType).toBe('movie')
    expect(record.publishedAt).toBe('2021-10-22')
    expect(record.sourceUrl).toBe('https://www.themoviedb.org/movie/1')
    expect(record.id).toBe('tmdb:movie:1')
  })

  it('uses name/first_air_date, tv url path and mediaType tv-show for tv results', () => {
    const record = normaliseTmdbSearchResult(
      baseSearchResult({
        media_type: 'tv',
        name: 'Dune: Prophecy',
        first_air_date: '2024-11-17',
      })
    )
    expect(record.title).toBe('Dune: Prophecy')
    expect(record.mediaType).toBe('tv-show')
    expect(record.publishedAt).toBe('2024-11-17')
    expect(record.sourceUrl).toBe('https://www.themoviedb.org/tv/1')
    expect(record.id).toBe('tmdb:tv:1')
  })

  it('defaults title to empty string when the branch-specific field is missing', () => {
    const record = normaliseTmdbSearchResult(baseSearchResult({ media_type: 'movie' }))
    expect(record.title).toBe('')
  })
})

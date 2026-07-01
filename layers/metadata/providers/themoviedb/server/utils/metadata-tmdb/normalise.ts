import type { MetadataCreator, MetadataRecord } from '#layers/metadata/shared/types'

import type { TMDBMovie, TMDBSearchMultiResult, TMDBTVShow } from './types'

// fallow-ignore-next-line complexity
export function normaliseTmdbMovie(movie: TMDBMovie): MetadataRecord {
  const directors: MetadataCreator[] = (movie.credits?.crew ?? [])
    .filter((c) => c.job === 'Director')
    .map((c) => ({ name: c.name, role: 'Director', providerId: String(c.id) }))

  return {
    id: `tmdb:movie:${movie.id}`,
    provider: 'tmdb',
    providerId: String(movie.id),
    mediaType: 'movie',
    title: movie.title,
    ...(movie.overview && { description: movie.overview }),
    ...(directors.length && { creators: directors }),
    ...(movie.production_companies?.[0]?.name && {
      publisher: movie.production_companies[0].name,
    }),
    ...(movie.release_date && { publishedAt: movie.release_date }),
    ...(movie.poster_path && { coverUrl: tmdbImageUrl(movie.poster_path) }),
    identifiers: {
      tmdbId: String(movie.id),
      ...(movie.external_ids?.imdb_id && { imdbId: movie.external_ids.imdb_id }),
    },
    sourceUrl: `https://www.themoviedb.org/movie/${movie.id}`,
    raw: movie,
    lastSyncedAt: new Date().toISOString(),
  }
}

// fallow-ignore-next-line complexity
export function normaliseTmdbTV(show: TMDBTVShow): MetadataRecord {
  const creators: MetadataCreator[] = (show.created_by ?? []).map((c) => ({
    name: c.name,
    role: 'Creator',
    providerId: String(c.id),
  }))

  return {
    id: `tmdb:tv:${show.id}`,
    provider: 'tmdb',
    providerId: String(show.id),
    mediaType: 'tv-show',
    title: show.name,
    ...(show.overview && { description: show.overview }),
    ...(creators.length && { creators }),
    ...(show.networks?.[0]?.name && { publisher: show.networks[0].name }),
    ...(show.first_air_date && { publishedAt: show.first_air_date }),
    ...(show.poster_path && { coverUrl: tmdbImageUrl(show.poster_path) }),
    identifiers: {
      tmdbId: String(show.id),
      ...(show.external_ids?.imdb_id && { imdbId: show.external_ids.imdb_id }),
    },
    sourceUrl: `https://www.themoviedb.org/tv/${show.id}`,
    raw: show,
    lastSyncedAt: new Date().toISOString(),
  }
}

export function normaliseTmdbSearchResult(result: TMDBSearchMultiResult): MetadataRecord {
  const isMovie = result.media_type === 'movie'
  const title = (isMovie ? result.title : result.name) ?? ''
  const date = isMovie ? result.release_date : result.first_air_date
  const type = isMovie ? 'movie' : 'tv'

  return {
    id: `tmdb:${type}:${result.id}`,
    provider: 'tmdb',
    providerId: String(result.id),
    mediaType: isMovie ? 'movie' : 'tv-show',
    title,
    ...(result.overview && { description: result.overview }),
    ...(date && { publishedAt: date }),
    ...(result.poster_path && { coverUrl: tmdbImageUrl(result.poster_path) }),
    identifiers: { tmdbId: String(result.id) },
    sourceUrl: `https://www.themoviedb.org/${type}/${result.id}`,
    raw: result,
    lastSyncedAt: new Date().toISOString(),
  }
}

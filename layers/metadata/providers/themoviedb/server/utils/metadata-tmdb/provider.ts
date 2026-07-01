import type { MetadataProvider } from '#layers/metadata/shared/types'

export const tmdbProvider: MetadataProvider = {
  id: 'tmdb',
  label: 'The Movie Database',
  mediaTypes: ['movie', 'tv-show'],

  async search({ query, mediaType, limit = 10 }) {
    const res = await searchTmdb(query, limit)
    return res.results
      .filter((r) => {
        if (r.media_type === 'person') return false
        if (mediaType === 'movie') return r.media_type === 'movie'
        if (mediaType === 'tv-show') return r.media_type === 'tv'
        return true
      })
      .map(normaliseTmdbSearchResult)
  },

  async lookup({ providerId, resourceType = 'movie' }) {
    // Accept IMDB tt-prefixed IDs — resolve via TMDB's /find endpoint
    if (providerId.startsWith('tt')) {
      const found = await findByImdbId(providerId)
      const movie = found.movie_results[0]
      const tv = found.tv_results[0]
      if (movie) return normaliseTmdbMovie(await fetchTmdbMovie(movie.id))
      if (tv) return normaliseTmdbTV(await fetchTmdbTV(tv.id))
      return null
    }
    if (resourceType === 'tv-show') return normaliseTmdbTV(await fetchTmdbTV(providerId))
    return normaliseTmdbMovie(await fetchTmdbMovie(providerId))
  },

  async sync(input) {
    return (await tmdbProvider.lookup!(input))!
  },
}

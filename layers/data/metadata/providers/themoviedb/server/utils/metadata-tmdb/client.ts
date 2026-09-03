import type { TMDBFindResponse, TMDBMovie, TMDBSearchResponse, TMDBTVShow } from './types'

function getConfig() {
  const config = useRuntimeConfig()
  return config.metadataTmdb
}

export function tmdbImageUrl(path: string, size?: string): string
export function tmdbImageUrl(path: string | null, size?: string): string | undefined
export function tmdbImageUrl(path: string | null, size = 'w500'): string | undefined {
  if (!path) return undefined
  return `${getConfig().imageBaseUrl}/${size}${path}`
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const { apiKey, baseUrl } = getConfig()

  const url = new URL(`${baseUrl}${path}`)
  // JWT (v4 Read Access Token) → Bearer header; hex string → legacy api_key param
  const isJwt = apiKey.startsWith('eyJ')
  if (!isJwt) url.searchParams.set('api_key', apiKey)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)

  try {
    return await $fetch<T>(url.toString(), {
      ...(isJwt && { headers: { Authorization: `Bearer ${apiKey}` } }),
    })
  } catch (err) {
    throw new MetadataProviderError('tmdb', `API error: ${String(err)}`)
  }
}

export async function searchTmdb(query: string, limit = 10): Promise<TMDBSearchResponse> {
  const res = await tmdbFetch<TMDBSearchResponse>('/search/multi', {
    query,
    language: 'en-US',
    page: '1',
  })
  return { ...res, results: res.results.slice(0, limit) }
}

export async function fetchTmdbMovie(id: string | number): Promise<TMDBMovie> {
  return tmdbFetch<TMDBMovie>(`/movie/${id}`, {
    append_to_response: 'external_ids,credits',
    language: 'en-US',
  })
}

export async function fetchTmdbTV(id: string | number): Promise<TMDBTVShow> {
  return tmdbFetch<TMDBTVShow>(`/tv/${id}`, {
    append_to_response: 'external_ids,credits',
    language: 'en-US',
  })
}

export async function findByImdbId(imdbId: string): Promise<TMDBFindResponse> {
  return tmdbFetch<TMDBFindResponse>(`/find/${imdbId}`, {
    external_source: 'imdb_id',
  })
}

import type { GoogleBooksSearchResponse, GoogleBooksVolume } from './types'

const BASE = 'https://www.googleapis.com/books/v1'

function getApiKey(): string | undefined {
  return useRuntimeConfig().metadataGoogleBooks?.apiKey || undefined
}

export async function searchGoogleBooks(query: string, limit = 10): Promise<GoogleBooksSearchResponse> {
  const params: Record<string, string> = { q: query, maxResults: String(limit) }
  const apiKey = getApiKey()
  if (apiKey) params.key = apiKey

  return $fetch<GoogleBooksSearchResponse>(`${BASE}/volumes`, { query: params })
}

export async function fetchGoogleBooksVolume(id: string): Promise<GoogleBooksVolume> {
  const params: Record<string, string> = {}
  const apiKey = getApiKey()
  if (apiKey) params.key = apiKey

  return $fetch<GoogleBooksVolume>(`${BASE}/volumes/${id}`, { query: params })
}

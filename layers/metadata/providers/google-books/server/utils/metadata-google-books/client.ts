import type { GoogleBooksSearchResponse, GoogleBooksVolume } from './types'

const BASE = 'https://www.googleapis.com/books/v1'

export function googleBooksMediaType(categories?: string[]): import('#layers/metadata/shared/types').MetadataMediaType {
  const joined = (categories ?? []).join(' ').toLowerCase()
  if (joined.includes('manga')) return 'manga'
  if (joined.includes('comic') || joined.includes('graphic novel')) return 'graphic-novel'
  return 'book'
}

export function googleBooksCoverUrl(url: string, width = 800): string {
  return url
    .replace('http://', 'https://')
    .replace(/&zoom=\d+/, '&zoom=3')
    .replace('&edge=curl', '')
    + `&fife=w${width}`
}

function getApiKey(): string | undefined {
  return useRuntimeConfig().metadataGoogleBooks?.apiKey || undefined
}

export async function searchGoogleBooks(
  query: string,
  limit = 10
): Promise<GoogleBooksSearchResponse> {
  const params: Record<string, string> = { q: query, maxResults: String(limit), langRestrict: 'en' }
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

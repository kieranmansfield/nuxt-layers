import type { ComicVineApiResponse } from './types'

const FIELD_LIST_ISSUE = 'id,name,issue_number,description,deck,cover_date,store_date,site_detail_url,image,volume,person_credits,publisher'
const FIELD_LIST_VOLUME = 'id,name,description,deck,start_year,site_detail_url,image,publisher,people'

function getConfig() {
  const config = useRuntimeConfig()
  return config.metadataComicvine
}

async function comicVineFetch<T>(path: string, params: Record<string, string>): Promise<ComicVineApiResponse<T>> {
  const { apiKey, baseUrl } = getConfig()

  const url = new URL(`${baseUrl}${path}`)
  url.searchParams.set('api_key', apiKey)
  url.searchParams.set('format', 'json')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)

  const res = await $fetch<ComicVineApiResponse<T>>(url.toString())
  if (res.status_code !== 1) throw new MetadataProviderError('comicvine', `API error: ${res.error}`)
  return res
}

export async function searchComicVineIssues(query: string, limit = 10) {
  return comicVineFetch<import('./types').ComicVineIssue[]>('/search/', {
    query,
    resources: 'issue',
    limit: String(limit),
    field_list: FIELD_LIST_ISSUE,
  })
}

export async function searchComicVineVolumes(query: string, limit = 10) {
  return comicVineFetch<import('./types').ComicVineVolume[]>('/search/', {
    query,
    resources: 'volume',
    limit: String(limit),
    field_list: FIELD_LIST_VOLUME,
  })
}

export async function fetchComicVineIssue(id: string) {
  return comicVineFetch<import('./types').ComicVineIssue>(`/issue/4000-${id}/`, {
    field_list: FIELD_LIST_ISSUE,
  })
}

export async function fetchComicVineVolume(id: string) {
  return comicVineFetch<import('./types').ComicVineVolume>(`/volume/4050-${id}/`, {
    field_list: FIELD_LIST_VOLUME,
  })
}

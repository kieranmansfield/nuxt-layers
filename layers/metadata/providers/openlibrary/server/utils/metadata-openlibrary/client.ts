import type { OpenLibraryEdition, OpenLibrarySearchResponse, OpenLibraryWork } from './types'

const BASE = 'https://openlibrary.org'

export function openLibraryCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'L'): string {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
}

export async function searchOpenLibrary(
  query: string,
  limit = 10
): Promise<OpenLibrarySearchResponse> {
  try {
    return await $fetch<OpenLibrarySearchResponse>(`${BASE}/search.json`, {
      timeout: 10000,
      query: {
        q: query,
        limit,
        fields:
          'key,title,subtitle,author_name,author_key,publisher,first_publish_year,isbn,cover_i,number_of_pages_median',
      },
    })
  } catch (err) {
    throw new MetadataProviderError('openlibrary', `API error: ${String(err)}`)
  }
}

export async function lookupOpenLibraryWork(workId: string): Promise<OpenLibraryWork> {
  try {
    return await $fetch<OpenLibraryWork>(`${BASE}/works/${workId}.json`)
  } catch (err) {
    throw new MetadataProviderError('openlibrary', `API error: ${String(err)}`)
  }
}

export async function lookupOpenLibraryEdition(editionId: string): Promise<OpenLibraryEdition> {
  try {
    return await $fetch<OpenLibraryEdition>(`${BASE}/books/${editionId}.json`)
  } catch (err) {
    throw new MetadataProviderError('openlibrary', `API error: ${String(err)}`)
  }
}

export async function lookupByIsbn(isbn: string): Promise<OpenLibraryEdition | null> {
  try {
    return await $fetch<OpenLibraryEdition>(`${BASE}/isbn/${isbn}.json`)
  } catch {
    return null
  }
}

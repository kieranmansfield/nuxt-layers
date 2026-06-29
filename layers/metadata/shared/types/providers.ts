import type { MetadataMediaType, MetadataRecord } from './metadata'

export type MetadataProviderId = 'comicvine' | 'openlibrary' | 'google-books' | 'local'

export type MetadataSearchInput = {
  query: string
  mediaType?: MetadataMediaType
  providers?: MetadataProviderId[]
  limit?: number
}

export type MetadataLookupInput = {
  provider: MetadataProviderId
  providerId: string
  resourceType?: string
}

export type MetadataSyncInput = {
  provider: MetadataProviderId
  providerId: string
  resourceType?: string
  force?: boolean
}

export type MetadataSearchResult = MetadataRecord & {
  score?: number
}

export type MetadataProvider = {
  id: MetadataProviderId
  label: string
  mediaTypes: MetadataMediaType[]
  search: (input: MetadataSearchInput) => Promise<MetadataSearchResult[]>
  lookup: (input: MetadataLookupInput) => Promise<MetadataRecord | null>
  sync?: (input: MetadataSyncInput) => Promise<MetadataRecord>
}

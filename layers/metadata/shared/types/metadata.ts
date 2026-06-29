import type { MetadataProviderId } from './providers'

export type MetadataMediaType =
  | 'book'
  | 'comic'
  | 'manga'
  | 'graphic-novel'
  | 'collected-edition'

export type MetadataCreator = {
  name: string
  role?: string
  providerId?: string
}

export type MetadataIdentifiers = {
  isbn10?: string
  isbn13?: string
  comicVineId?: string
  openLibraryId?: string
  googleBooksId?: string
}

export type MetadataRecord = {
  id: string
  provider: MetadataProviderId
  providerId: string
  mediaType: MetadataMediaType
  title: string
  subtitle?: string
  description?: string
  creators?: MetadataCreator[]
  publisher?: string
  publishedAt?: string
  coverUrl?: string
  identifiers?: MetadataIdentifiers
  sourceUrl?: string
  raw?: unknown
  lastSyncedAt?: string
}

export type MetadataCacheRecord = {
  id: string
  provider: MetadataProviderId
  providerId: string
  resourceType: string
  mediaType: MetadataMediaType
  normalised: MetadataRecord
  raw: unknown
  createdAt: string
  updatedAt: string
  lastSyncedAt: string
  expiresAt?: string
}

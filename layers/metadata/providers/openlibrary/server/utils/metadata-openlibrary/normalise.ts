import type { MetadataCreator, MetadataRecord } from '#layers/metadata/shared/types'

import type { OpenLibraryEdition, OpenLibrarySearchDoc, OpenLibraryWork } from './types'

// fallow-ignore-next-line complexity
export function normaliseOpenLibrarySearchDoc(doc: OpenLibrarySearchDoc): MetadataRecord {
  const creators: MetadataCreator[] = (doc.author_name ?? []).map((name, i) => ({
    name,
    role: 'author',
    providerId: doc.author_key?.[i]?.replace('/authors/', '') ?? undefined,
  }))

  const id = doc.key.replace('/works/', '')

  return {
    id: `openlibrary:work:${id}`,
    provider: 'openlibrary',
    providerId: id,
    mediaType: 'book',
    title: doc.title,
    subtitle: doc.subtitle,
    creators: creators.length ? creators : undefined,
    publisher: doc.publisher?.[0] ?? undefined,
    publishedAt: doc.first_publish_year ? String(doc.first_publish_year) : undefined,
    coverUrl: doc.cover_i ? openLibraryCoverUrl(doc.cover_i) : undefined,
    identifiers: {
      isbn10: doc.isbn?.find((i) => i.length === 10),
      isbn13: doc.isbn?.find((i) => i.length === 13),
      openLibraryId: id,
    },
    sourceUrl: `https://openlibrary.org${doc.key}`,
    raw: doc,
    lastSyncedAt: new Date().toISOString(),
  }
}

// fallow-ignore-next-line complexity
export function normaliseOpenLibraryWork(work: OpenLibraryWork): MetadataRecord {
  const id = work.key.replace('/works/', '')
  const desc = typeof work.description === 'string' ? work.description : work.description?.value

  return {
    id: `openlibrary:work:${id}`,
    provider: 'openlibrary',
    providerId: id,
    mediaType: 'book',
    title: work.title,
    subtitle: work.subtitle,
    description: desc,
    coverUrl: work.covers?.[0] ? openLibraryCoverUrl(work.covers[0]) : undefined,
    publishedAt: work.first_publish_date,
    identifiers: { openLibraryId: id },
    sourceUrl: `https://openlibrary.org${work.key}`,
    raw: work,
    lastSyncedAt: new Date().toISOString(),
  }
}

// fallow-ignore-next-line complexity
export function normaliseOpenLibraryEdition(edition: OpenLibraryEdition): MetadataRecord {
  const id = edition.key.replace('/books/', '')

  return {
    id: `openlibrary:edition:${id}`,
    provider: 'openlibrary',
    providerId: id,
    mediaType: 'book',
    title: edition.title,
    subtitle: edition.subtitle,
    publisher: edition.publishers?.[0] ?? undefined,
    publishedAt: edition.publish_date,
    coverUrl: edition.covers?.[0] ? openLibraryCoverUrl(edition.covers[0]) : undefined,
    identifiers: {
      isbn10: edition.isbn_10?.[0],
      isbn13: edition.isbn_13?.[0],
      openLibraryId: id,
    },
    sourceUrl: `https://openlibrary.org${edition.key}`,
    raw: edition,
    lastSyncedAt: new Date().toISOString(),
  }
}

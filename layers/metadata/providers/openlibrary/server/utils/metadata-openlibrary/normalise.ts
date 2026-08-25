import type { MetadataCreator, MetadataRecord } from '#layers/metadata/shared/types'

import type { OpenLibraryEdition, OpenLibrarySearchDoc, OpenLibraryWork } from './types'

// fallow-ignore-next-line complexity
export function normaliseOpenLibrarySearchDoc(doc: OpenLibrarySearchDoc): MetadataRecord {
  const creators: MetadataCreator[] = (doc.author_name ?? []).map((name, i) => {
    const providerId = doc.author_key?.[i]?.replace('/authors/', '')
    return {
      name,
      role: 'author',
      ...(providerId && { providerId }),
    }
  })

  const id = doc.key.replace('/works/', '')
  const isbn10 = doc.isbn?.find((i) => i.length === 10)
  const isbn13 = doc.isbn?.find((i) => i.length === 13)

  return {
    id: `openlibrary:work:${id}`,
    provider: 'openlibrary',
    providerId: id,
    mediaType: 'book',
    title: doc.title,
    ...(doc.subtitle && { subtitle: doc.subtitle }),
    ...(creators.length && { creators }),
    ...(doc.publisher?.[0] && { publisher: doc.publisher[0] }),
    ...(doc.first_publish_year && { publishedAt: String(doc.first_publish_year) }),
    ...(doc.cover_i && { coverUrl: openLibraryCoverUrl(doc.cover_i) }),
    identifiers: {
      ...(isbn10 && { isbn10 }),
      ...(isbn13 && { isbn13 }),
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
    ...(work.subtitle && { subtitle: work.subtitle }),
    ...(desc && { description: desc }),
    ...(work.covers?.[0] && { coverUrl: openLibraryCoverUrl(work.covers[0]) }),
    ...(work.first_publish_date && { publishedAt: work.first_publish_date }),
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
    ...(edition.subtitle && { subtitle: edition.subtitle }),
    ...(edition.publishers?.[0] && { publisher: edition.publishers[0] }),
    ...(edition.publish_date && { publishedAt: edition.publish_date }),
    ...(edition.covers?.[0] && { coverUrl: openLibraryCoverUrl(edition.covers[0]) }),
    identifiers: {
      ...(edition.isbn_10?.[0] && { isbn10: edition.isbn_10[0] }),
      ...(edition.isbn_13?.[0] && { isbn13: edition.isbn_13[0] }),
      openLibraryId: id,
    },
    sourceUrl: `https://openlibrary.org${edition.key}`,
    raw: edition,
    lastSyncedAt: new Date().toISOString(),
  }
}

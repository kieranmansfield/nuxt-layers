import type { MetadataCreator, MetadataRecord } from '#layers/metadata/shared/types'

import type { GoogleBooksVolume, GoogleBooksVolumeInfo } from './types'

function resolveGoogleBooksIsbns(volumeInfo: GoogleBooksVolumeInfo) {
  const isbn10 = volumeInfo.industryIdentifiers?.find((i) => i.type === 'ISBN_10')?.identifier
  const isbn13 = volumeInfo.industryIdentifiers?.find((i) => i.type === 'ISBN_13')?.identifier
  return { isbn10, isbn13 }
}

function resolveGoogleBooksRawCover(volumeInfo: GoogleBooksVolumeInfo) {
  return (
    volumeInfo.imageLinks?.extraLarge ??
    volumeInfo.imageLinks?.large ??
    volumeInfo.imageLinks?.medium ??
    volumeInfo.imageLinks?.small ??
    volumeInfo.imageLinks?.thumbnail ??
    volumeInfo.imageLinks?.smallThumbnail
  )
}

export function normaliseGoogleBooksVolume(volume: GoogleBooksVolume): MetadataRecord {
  const { volumeInfo } = volume

  const creators: MetadataCreator[] = (volumeInfo.authors ?? []).map((name) => ({
    name,
    role: 'author',
  }))

  const { isbn10, isbn13 } = resolveGoogleBooksIsbns(volumeInfo)
  const rawCover = resolveGoogleBooksRawCover(volumeInfo)
  const sourceUrl = volumeInfo.canonicalVolumeLink ?? volumeInfo.infoLink

  return {
    id: `google-books:volume:${volume.id}`,
    provider: 'google-books',
    providerId: volume.id,
    mediaType: googleBooksMediaType(volumeInfo.categories),
    title: volumeInfo.title,
    ...(volumeInfo.subtitle && { subtitle: volumeInfo.subtitle }),
    ...(volumeInfo.description && { description: volumeInfo.description }),
    ...(creators.length && { creators }),
    ...(volumeInfo.publisher && { publisher: volumeInfo.publisher }),
    ...(volumeInfo.publishedDate && { publishedAt: volumeInfo.publishedDate }),
    ...(rawCover && { coverUrl: googleBooksCoverUrl(rawCover) }),
    identifiers: {
      ...(isbn10 && { isbn10 }),
      ...(isbn13 && { isbn13 }),
      googleBooksId: volume.id,
    },
    ...(sourceUrl && { sourceUrl }),
    raw: volume,
    lastSyncedAt: new Date().toISOString(),
  }
}

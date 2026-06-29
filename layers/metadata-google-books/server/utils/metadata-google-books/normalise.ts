import type { MetadataRecord, MetadataCreator } from '#layers/metadata/shared/types'
import type { GoogleBooksVolume } from './types'

// fallow-ignore-next-line complexity
export function normaliseGoogleBooksVolume(volume: GoogleBooksVolume): MetadataRecord {
  const { volumeInfo } = volume

  const creators: MetadataCreator[] = (volumeInfo.authors ?? []).map((name) => ({
    name,
    role: 'author',
  }))

  const isbn10 = volumeInfo.industryIdentifiers?.find((i) => i.type === 'ISBN_10')?.identifier
  const isbn13 = volumeInfo.industryIdentifiers?.find((i) => i.type === 'ISBN_13')?.identifier

  const cover = volumeInfo.imageLinks?.thumbnail ?? volumeInfo.imageLinks?.smallThumbnail

  return {
    id: `google-books:volume:${volume.id}`,
    provider: 'google-books',
    providerId: volume.id,
    mediaType: 'book',
    title: volumeInfo.title,
    subtitle: volumeInfo.subtitle,
    description: volumeInfo.description,
    creators: creators.length ? creators : undefined,
    publisher: volumeInfo.publisher,
    publishedAt: volumeInfo.publishedDate,
    coverUrl: cover ? cover.replace('http://', 'https://') : undefined,
    identifiers: {
      isbn10,
      isbn13,
      googleBooksId: volume.id,
    },
    sourceUrl: volumeInfo.canonicalVolumeLink ?? volumeInfo.infoLink,
    raw: volume,
    lastSyncedAt: new Date().toISOString(),
  }
}

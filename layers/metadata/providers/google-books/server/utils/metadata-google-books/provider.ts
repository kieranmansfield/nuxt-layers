import type { MetadataProvider } from '#layers/metadata/shared/types'

export const googleBooksProvider: MetadataProvider = {
  id: 'google-books',
  label: 'Google Books',
  mediaTypes: ['book', 'graphic-novel', 'manga'],

  async search({ query, mediaType, limit = 10 }) {
    const subjectHints: Record<string, string> = {
      'graphic-novel': '+subject:"Comics & Graphic Novels"',
      'manga': '+subject:manga',
      'book': '+-subject:"Comics & Graphic Novels"+-subject:manga',
    }
    const q = query + (mediaType ? (subjectHints[mediaType] ?? '') : '')
    const res = await searchGoogleBooks(q, limit)
    const records = (res.items ?? []).map(normaliseGoogleBooksVolume)
    return mediaType ? records.filter((r) => r.mediaType === mediaType) : records
  },

  async lookup({ providerId }) {
    const volume = await fetchGoogleBooksVolume(providerId)
    return normaliseGoogleBooksVolume(volume)
  },

  async sync({ providerId }) {
    return (await googleBooksProvider.lookup!({ provider: 'google-books', providerId }))!
  },
}

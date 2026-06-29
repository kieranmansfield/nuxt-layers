import type { MetadataProvider } from '#layers/metadata/shared/types'

export const googleBooksProvider: MetadataProvider = {
  id: 'google-books',
  label: 'Google Books',
  mediaTypes: ['book', 'graphic-novel', 'collected-edition'],

  async search({ query, limit = 10 }) {
    const res = await searchGoogleBooks(query, limit)
    return (res.items ?? []).map(normaliseGoogleBooksVolume)
  },

  async lookup({ providerId }) {
    const volume = await fetchGoogleBooksVolume(providerId)
    return normaliseGoogleBooksVolume(volume)
  },

  async sync({ providerId }) {
    return (await googleBooksProvider.lookup!({ provider: 'google-books', providerId }))!
  },
}

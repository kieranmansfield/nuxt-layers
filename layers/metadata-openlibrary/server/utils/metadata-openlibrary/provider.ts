import type { MetadataProvider } from '#layers/metadata/shared/types'

export const openLibraryProvider: MetadataProvider = {
  id: 'openlibrary',
  label: 'Open Library',
  mediaTypes: ['book', 'graphic-novel', 'collected-edition'],

  async search({ query, limit = 10 }) {
    const res = await searchOpenLibrary(query, limit)
    return res.docs.map(normaliseOpenLibrarySearchDoc)
  },

  async lookup({ providerId, resourceType = 'work' }) {
    if (resourceType === 'edition') {
      const edition = await lookupOpenLibraryEdition(providerId)
      return normaliseOpenLibraryEdition(edition)
    }
    const work = await lookupOpenLibraryWork(providerId)
    return normaliseOpenLibraryWork(work)
  },

  async sync({ providerId, resourceType = 'work' }) {
    return (await openLibraryProvider.lookup!({ provider: 'openlibrary', providerId, resourceType }))!
  },
}

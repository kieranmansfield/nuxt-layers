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
    const record = await openLibraryProvider.lookup({
      provider: 'openlibrary',
      providerId,
      resourceType,
    })
    if (!record) throw new MetadataProviderError('openlibrary', `No record found for ${providerId}`)
    return record
  },
}

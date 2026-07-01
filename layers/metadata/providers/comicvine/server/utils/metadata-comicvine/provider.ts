import type { MetadataProvider } from '#layers/metadata/shared/types'

// Matches CJK, Hangul, Arabic, Hebrew, Thai, Devanagari, Cyrillic, etc.
const NON_LATIN_RE = /[Ͱ-ϿЀ-ӿ؀-ۿऀ-ॿ　-鿿가-힯豈-﫿]/

function isEnglish(title: string): boolean {
  return !NON_LATIN_RE.test(title)
}

export const comicVineProvider: MetadataProvider = {
  id: 'comicvine',
  label: 'Comic Vine',
  mediaTypes: ['comic', 'comic-series'],

  async search({ query, mediaType, limit = 10 }) {
    if (mediaType === 'comic-series') {
      const res = await searchComicVineVolumes(query, limit)
      return (Array.isArray(res.results) ? res.results : [])
        .filter((v) => isEnglish(v.name))
        .map(normaliseComicVineVolume)
    }

    if (mediaType === 'comic') {
      const res = await searchComicVineIssues(query, limit)
      return (Array.isArray(res.results) ? res.results : [])
        .filter((i) => isEnglish(i.name ?? i.volume?.name ?? ''))
        .map(normaliseComicVineIssue)
    }

    // All — split limit between issues and series
    const [issueRes, volumeRes] = await Promise.all([
      searchComicVineIssues(query, Math.ceil(limit / 2)),
      searchComicVineVolumes(query, Math.floor(limit / 2)),
    ])
    const issues = (Array.isArray(issueRes.results) ? issueRes.results : [])
      .filter((i) => isEnglish(i.name ?? i.volume?.name ?? ''))
      .map(normaliseComicVineIssue)
    const volumes = (Array.isArray(volumeRes.results) ? volumeRes.results : [])
      .filter((v) => isEnglish(v.name))
      .map(normaliseComicVineVolume)
    return [...issues, ...volumes]
  },

  async lookup({ providerId, resourceType = 'issue' }) {
    if (resourceType === 'volume') {
      const res = await fetchComicVineVolume(providerId)
      return normaliseComicVineVolume(res.results as import('./types').ComicVineVolume)
    }
    const res = await fetchComicVineIssue(providerId)
    return normaliseComicVineIssue(res.results as import('./types').ComicVineIssue)
  },

  async sync({ providerId, resourceType = 'issue' }) {
    return (await comicVineProvider.lookup!({ provider: 'comicvine', providerId, resourceType }))!
  },
}

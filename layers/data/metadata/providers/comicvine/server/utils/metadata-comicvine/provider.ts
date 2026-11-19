import { normaliseComicVineIssue, normaliseComicVineVolume } from './normalise'
import {
  fetchComicVineIssue,
  fetchComicVineVolume,
  searchComicVineIssues,
  searchComicVineVolumes,
} from './client'
import type { MetadataProvider } from '#layers/metadata/shared/types'

import type { ComicVineIssue, ComicVineVolume } from './types'

// Devanagari comes first: U+0900 is a combining mark, which lint flags when it follows another char
// Matches CJK, Hangul, Arabic, Hebrew, Thai, Devanagari, Cyrillic, etc.
const NON_LATIN_RE =
  /[\u0900-\u097F\u0370-\u03FF\u0400-\u04FF\u0600-\u06FF\u3000-\u9FFF\uAC00-\uD7AF\uF900-\uFAFF]/

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
        .map((v) => normaliseComicVineVolume(v))
    }

    if (mediaType === 'comic') {
      const res = await searchComicVineIssues(query, limit)
      return (Array.isArray(res.results) ? res.results : [])
        .filter((i) => isEnglish(i.name ?? i.volume?.name ?? ''))
        .map((i) => normaliseComicVineIssue(i))
    }

    // All — split limit between issues and series
    const [issueRes, volumeRes] = await Promise.all([
      searchComicVineIssues(query, Math.ceil(limit / 2)),
      searchComicVineVolumes(query, Math.floor(limit / 2)),
    ])
    const issues = (Array.isArray(issueRes.results) ? issueRes.results : [])
      .filter((i) => isEnglish(i.name ?? i.volume?.name ?? ''))
      .map((i) => normaliseComicVineIssue(i))
    const volumes = (Array.isArray(volumeRes.results) ? volumeRes.results : [])
      .filter((v) => isEnglish(v.name))
      .map((v) => normaliseComicVineVolume(v))
    return [...issues, ...volumes]
  },

  async lookup({ providerId, resourceType = 'issue' }) {
    if (resourceType === 'volume') {
      const res = await fetchComicVineVolume(providerId)
      return normaliseComicVineVolume(res.results as ComicVineVolume)
    }
    const res = await fetchComicVineIssue(providerId)
    return normaliseComicVineIssue(res.results as ComicVineIssue)
  },
}

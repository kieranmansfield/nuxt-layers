import type { MetadataCreator, MetadataRecord } from '#layers/metadata/shared/types'

import type { ComicVineIssue, ComicVineVolume } from './types'

// fallow-ignore-next-line complexity
export function normaliseComicVineIssue(issue: ComicVineIssue): MetadataRecord {
  const creators: MetadataCreator[] = (issue.person_credits ?? []).map((p) => ({
    name: p.name,
    role: p.role,
    providerId: String(p.id),
  }))

  const description = issue.deck ?? issue.description
  const publishedAt = issue.cover_date ?? issue.store_date
  const coverUrl = issue.image?.medium_url ?? issue.image?.original_url

  return {
    id: `comicvine:issue:${issue.id}`,
    provider: 'comicvine',
    providerId: String(issue.id),
    mediaType: 'comic',
    title: issue.volume?.name
      ? `${issue.volume.name} #${issue.issue_number}`
      : (issue.name ?? `Issue #${issue.issue_number}`),
    ...(issue.name && { subtitle: issue.name }),
    ...(description && { description }),
    ...(creators.length && { creators }),
    ...(issue.publisher?.name && { publisher: issue.publisher.name }),
    ...(publishedAt && { publishedAt }),
    ...(coverUrl && { coverUrl }),
    identifiers: { comicVineId: String(issue.id) },
    sourceUrl: issue.site_detail_url,
    raw: issue,
    lastSyncedAt: new Date().toISOString(),
  }
}

// fallow-ignore-next-line complexity
export function normaliseComicVineVolume(volume: ComicVineVolume): MetadataRecord {
  const creators: MetadataCreator[] = (volume.people ?? []).map((p) => ({
    name: p.name,
    role: p.role,
    providerId: String(p.id),
  }))

  const subtitle = [
    volume.publisher?.name,
    volume.count_of_issues
      ? `${volume.count_of_issues} issue${volume.count_of_issues === 1 ? '' : 's'}`
      : null,
  ]
    .filter(Boolean)
    .join(' · ')
  const description = volume.deck ?? volume.description
  const coverUrl = volume.image?.medium_url ?? volume.image?.original_url

  return {
    id: `comicvine:volume:${volume.id}`,
    provider: 'comicvine',
    providerId: String(volume.id),
    mediaType: 'comic-series',
    title: volume.start_year ? `${volume.name} (${volume.start_year})` : volume.name,
    ...(subtitle && { subtitle }),
    ...(description && { description }),
    ...(creators.length && { creators }),
    ...(volume.publisher?.name && { publisher: volume.publisher.name }),
    ...(volume.start_year && { publishedAt: volume.start_year }),
    ...(coverUrl && { coverUrl }),
    identifiers: { comicVineId: String(volume.id) },
    sourceUrl: volume.site_detail_url,
    raw: volume,
    lastSyncedAt: new Date().toISOString(),
  }
}

import { createError } from 'h3'
import type { ObsidianPluginStats } from '#layers/project-stats/shared/types'

import { externalFetch } from './external-fetch'

// The community plugin directory that obsidian.md/plugins is built from
const RELEASES = 'https://raw.githubusercontent.com/obsidianmd/obsidian-releases/HEAD'

export type ObsidianListingEntry = {
  id: string
  name: string
  author: string
  description: string
  repo: string
}

/** Per-plugin entry in community-plugin-stats.json: totals plus one key per version. */
export type ObsidianStatsEntry = {
  downloads: number
  updated?: number
  [version: string]: number | undefined
}

export type ObsidianManifest = {
  version?: string
  minAppVersion?: string
  authorUrl?: string
  fundingUrl?: string | Record<string, string>
  isDesktopOnly?: boolean
}

function compareVersions(a: string, b: string): number {
  const pa = a.split(/[.-]/).map((n) => Number.parseInt(n, 10) || 0)
  const pb = b.split(/[.-]/).map((n) => Number.parseInt(n, 10) || 0)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0)
    if (diff) return diff
  }
  return 0
}

/** Highest version key in a stats entry (every key but the `downloads`/`updated` totals). */
export function latestStatsVersion(stats: ObsidianStatsEntry): string | undefined {
  return Object.keys(stats)
    .filter((k) => k !== 'downloads' && k !== 'updated')
    .sort(compareVersions)
    .at(-1)
}

// Optional details only the plugin's own manifest.json carries
function manifestFields(manifest: ObsidianManifest | null) {
  if (!manifest) return {}
  const funding = manifest.fundingUrl
  const fundingUrl = typeof funding === 'string' ? funding : Object.values(funding ?? {})[0]
  return {
    ...(manifest.minAppVersion && { minAppVersion: manifest.minAppVersion }),
    ...(manifest.authorUrl && { authorUrl: manifest.authorUrl }),
    ...(fundingUrl && { fundingUrl }),
    ...(manifest.isDesktopOnly !== undefined && { isDesktopOnly: manifest.isDesktopOnly }),
  }
}

// Obsidian appends this boilerplate to every unreviewed plugin's description; it is noise on a card
const UNREVIEWED = /\s*-?\s*This plugin has not been manually reviewed by Obsidian staff\.?/i

export function normaliseObsidianPlugin(
  entry: ObsidianListingEntry,
  stats: ObsidianStatsEntry | undefined,
  manifest: ObsidianManifest | null
): ObsidianPluginStats {
  const latestVersion = manifest?.version ?? (stats && latestStatsVersion(stats))
  const latestVersionDownloads = latestVersion ? stats?.[latestVersion] : undefined
  const id = encodeURIComponent(entry.id)
  return {
    id: entry.id,
    name: entry.name,
    author: entry.author,
    description: entry.description.replace(UNREVIEWED, '').trim(),
    repo: entry.repo,
    repoUrl: `https://github.com/${entry.repo}`,
    listingUrl: `https://obsidian.md/plugins?id=${id}`,
    installUrl: `obsidian://show-plugin?id=${id}`,
    downloads: stats?.downloads ?? 0,
    fetchedAt: new Date().toISOString(),
    ...(latestVersion && { latestVersion }),
    ...(latestVersionDownloads !== undefined && { latestVersionDownloads }),
    ...(stats?.updated && { updatedAt: new Date(stats.updated).toISOString() }),
    ...manifestFields(manifest),
  }
}

// raw.githubusercontent.com serves JSON as text/plain, so parse explicitly
const getJson = <T>(url: string) =>
  externalFetch<T>(url, { parseResponse: JSON.parse, timeout: 15000 })

type Directory = {
  listing: ObsidianListingEntry[]
  stats: Record<string, ObsidianStatsEntry>
}

// Both directory files are ~3 MB; share one download between the plugin cards on a page and
// across cache misses for an hour, instead of refetching per plugin id.
const DIRECTORY_TTL = 60 * 60 * 1000
let directory: { at: number; promise: Promise<Directory> } | undefined

function loadDirectory(): Promise<Directory> {
  if (directory && Date.now() - directory.at < DIRECTORY_TTL) return directory.promise
  const promise = Promise.all([
    getJson<ObsidianListingEntry[]>(`${RELEASES}/community-plugins.json`),
    getJson<Record<string, ObsidianStatsEntry>>(`${RELEASES}/community-plugin-stats.json`),
  ]).then(([listing, stats]) => ({ listing, stats }))
  directory = { at: Date.now(), promise }
  // Don't keep a failed download around for the whole TTL
  promise.catch(() => {
    if (directory?.promise === promise) directory = undefined
  })
  return promise
}

/** `id` must already be a validated plugin id. */
export async function fetchObsidianPluginStats(id: string): Promise<ObsidianPluginStats> {
  let dir: Directory
  try {
    dir = await loadDirectory()
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'Obsidian plugin directory unavailable' })
  }

  const entry = dir.listing.find((p) => p.id === id)
  if (!entry) {
    throw createError({ statusCode: 404, statusMessage: `Obsidian plugin not found: ${id}` })
  }

  // The manifest only adds version/app details — the listing alone is enough for the card
  const manifest = await getJson<ObsidianManifest>(
    `https://raw.githubusercontent.com/${entry.repo}/HEAD/manifest.json`
  ).catch(() => null)

  return normaliseObsidianPlugin(entry, dir.stats[id], manifest)
}

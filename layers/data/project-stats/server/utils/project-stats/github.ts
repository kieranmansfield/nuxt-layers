import { createError } from 'h3'
import type { GithubRepoStats } from '#layers/project-stats/shared/types'

import { externalFetch } from './external-fetch'

// The subset of the GitHub REST responses the card reads
export type GithubApiRepo = {
  full_name: string
  name: string
  owner: { login: string }
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  forks_count: number
  subscribers_count?: number
  open_issues_count: number
  language: string | null
  license: { spdx_id: string | null } | null
  topics?: string[]
  archived: boolean
  created_at: string
  pushed_at: string | null
}

export type GithubApiRelease = {
  tag_name: string
  name: string | null
  html_url: string
  published_at: string | null
  draft: boolean
  prerelease: boolean
  assets: Array<{ download_count: number }>
}

const API = 'https://api.github.com'

export function normaliseGithubRepo(
  repo: GithubApiRepo,
  releases: GithubApiRelease[],
  fetchedAt = new Date().toISOString()
): GithubRepoStats {
  const published = releases.filter((r) => !r.draft)
  const latest = published.find((r) => !r.prerelease) ?? published[0]
  // GitHub reports `NOASSERTION` for licenses it can't identify
  const license = repo.license?.spdx_id
  return {
    fullName: repo.full_name,
    owner: repo.owner.login,
    name: repo.name,
    url: repo.html_url,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    watchers: repo.subscribers_count ?? 0,
    openIssues: repo.open_issues_count,
    downloads: published.reduce(
      (sum, r) => sum + r.assets.reduce((n, a) => n + a.download_count, 0),
      0
    ),
    releases: published.length,
    topics: repo.topics ?? [],
    archived: repo.archived,
    createdAt: repo.created_at,
    fetchedAt,
    ...(repo.description && { description: repo.description }),
    ...(repo.homepage && { homepage: repo.homepage }),
    ...(repo.language && { language: repo.language }),
    ...(license && license !== 'NOASSERTION' && { license }),
    ...(repo.pushed_at && { pushedAt: repo.pushed_at }),
    ...(latest && {
      latestRelease: {
        tag: latest.tag_name,
        url: latest.html_url,
        ...(latest.name && { name: latest.name }),
        ...(latest.published_at && { publishedAt: latest.published_at }),
      },
    }),
  }
}

function statusOf(err: unknown): number | undefined {
  const e = err as { status?: number; statusCode?: number }
  return e?.status ?? e?.statusCode
}

/** `slug` must already be a validated `owner/name`. */
export async function fetchGithubRepoStats(slug: string, token = ''): Promise<GithubRepoStats> {
  const headers: Record<string, string> = {
    accept: 'application/vnd.github+json',
    'x-github-api-version': '2022-11-28',
    'user-agent': 'kmcom-layer-project-stats',
    ...(token && { authorization: `Bearer ${token}` }),
  }

  let repo: GithubApiRepo
  try {
    repo = await externalFetch<GithubApiRepo>(`${API}/repos/${slug}`, { headers, timeout: 10000 })
  } catch (err) {
    const status = statusOf(err)
    if (status === 404) {
      throw createError({ statusCode: 404, statusMessage: `GitHub repo not found: ${slug}` })
    }
    throw createError({
      statusCode: 502,
      statusMessage:
        status === 403 || status === 429
          ? 'GitHub rate limit reached — set NUXT_PROJECT_STATS_LAYER_GITHUB_TOKEN'
          : `GitHub request failed for ${slug}`,
    })
  }

  // Releases only add the download count — a failure here shouldn't hide the rest of the card
  const releases = await externalFetch<GithubApiRelease[]>(
    `${API}/repos/${repo.full_name}/releases`,
    {
      headers,
      timeout: 10000,
      query: { per_page: 100 },
    }
  ).catch(() => [])

  return normaliseGithubRepo(repo, releases)
}

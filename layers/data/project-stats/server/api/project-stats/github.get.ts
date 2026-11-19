import { createError, defineEventHandler, getQuery } from 'h3'
import { defineCachedFunction, useRuntimeConfig } from 'nitropack/runtime'

import { parseGithubRepo } from '#layers/project-stats/shared/ids'
import { fetchGithubRepoStats } from '../../utils/project-stats/github'

// Keyed by repo only — the token changes the rate limit, not the response. Errors aren't
// cached, and an expired entry is served while it refreshes (swr).
const cachedRepoStats = defineCachedFunction(
  (slug: string) => fetchGithubRepoStats(slug, useRuntimeConfig().projectStatsLayer?.githubToken),
  {
    name: 'github-repo',
    group: 'project-stats',
    maxAge: 60 * 60,
    getKey: (slug: string) => slug.toLowerCase(),
  }
)

export default defineEventHandler((event) => {
  const slug = parseGithubRepo(String(getQuery(event).repo ?? ''))
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Expected ?repo=owner/name' })
  }
  return cachedRepoStats(slug)
})

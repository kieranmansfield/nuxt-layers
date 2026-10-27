import type { MaybeRefOrGetter } from 'vue'

import type { GithubRepoStats } from '#layers/project-stats/shared/types'

// Widened to `string` so $fetch's typed-route inference doesn't recurse over every Nitro route
const GITHUB_URL: string = '/api/project-stats/github'

/** Stars, forks, watchers, issues and release downloads for `owner/name` (or a GitHub URL). */
export function useGithubRepoStats(repo: MaybeRefOrGetter<string>) {
  return useAsyncData(
    () => `project-stats:github:${toValue(repo)}`,
    () => $fetch<GithubRepoStats>(GITHUB_URL, { query: { repo: toValue(repo) } })
  )
}

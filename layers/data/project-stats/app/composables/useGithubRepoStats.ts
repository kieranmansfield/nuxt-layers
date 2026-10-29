import type { MaybeRefOrGetter } from 'vue'

import type { GithubRepoStats } from '#layers/project-stats/shared/types'

/** Stars, forks, watchers, issues and release downloads for `owner/name` (or a GitHub URL). */
export function useGithubRepoStats(repo: MaybeRefOrGetter<string>) {
  return useAsyncData(
    () => `project-stats:github:${toValue(repo)}`,
    () =>
      $fetch<GithubRepoStats>('/api/project-stats/github', {
        method: 'GET',
        body: undefined,
        query: { repo: toValue(repo) },
      })
  )
}

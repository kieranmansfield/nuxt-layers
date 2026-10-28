import type { MaybeRefOrGetter } from 'vue'

import type { ObsidianPluginStats } from '#layers/project-stats/shared/types'

/** Listing details and download counts for an Obsidian community plugin id. */
export function useObsidianPluginStats(id: MaybeRefOrGetter<string>) {
  return useAsyncData(
    () => `project-stats:obsidian:${toValue(id)}`,
    () =>
      $fetch<ObsidianPluginStats>('/api/project-stats/obsidian', {
        method: 'GET',
        body: undefined,
        query: { id: toValue(id) },
      })
  )
}

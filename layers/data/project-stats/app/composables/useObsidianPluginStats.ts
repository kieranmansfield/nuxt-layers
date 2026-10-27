import type { MaybeRefOrGetter } from 'vue'

import type { ObsidianPluginStats } from '#layers/project-stats/shared/types'

// Widened to `string` so $fetch's typed-route inference doesn't recurse over every Nitro route
const OBSIDIAN_URL: string = '/api/project-stats/obsidian'

/** Listing details and download counts for an Obsidian community plugin id. */
export function useObsidianPluginStats(id: MaybeRefOrGetter<string>) {
  return useAsyncData(
    () => `project-stats:obsidian:${toValue(id)}`,
    () => $fetch<ObsidianPluginStats>(OBSIDIAN_URL, { query: { id: toValue(id) } })
  )
}

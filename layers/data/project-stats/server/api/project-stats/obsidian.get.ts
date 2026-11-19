import { createError, defineEventHandler, getQuery } from 'h3'
import { defineCachedFunction } from 'nitropack/runtime'

import { isObsidianPluginId } from '#layers/project-stats/shared/ids'
import { fetchObsidianPluginStats } from '../../utils/project-stats/obsidian'

// The directory's download stats update roughly daily, so a few hours is plenty
const cachedPluginStats = defineCachedFunction((id: string) => fetchObsidianPluginStats(id), {
  name: 'obsidian-plugin',
  group: 'project-stats',
  maxAge: 6 * 60 * 60,
  getKey: (id: string) => id,
})

export default defineEventHandler((event) => {
  const id = String(getQuery(event).id ?? '').trim()
  if (!isObsidianPluginId(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Expected ?id=<plugin-id>' })
  }
  return cachedPluginStats(id)
})

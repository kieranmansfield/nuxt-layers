import { useFeatures } from '../composables/useFeatures'
import { resolveRoute } from '../utils/resolveRoute'

export default defineNuxtRouteMiddleware((to) => {
  const { config } = useRoutingConfig()
  const { resolve } = useFeatures()

  if (config.debug) console.log('[routing] governance check', to.path, to.meta)

  const resolution = resolveRoute(to.meta, config, resolve)

  if (config.debug) console.log('[routing] resolution', resolution)

  if (resolution.outcome === 'deny') throw createError({ statusCode: 404 })
  if (resolution.outcome === 'redirect') return navigateTo(resolution.to)
})

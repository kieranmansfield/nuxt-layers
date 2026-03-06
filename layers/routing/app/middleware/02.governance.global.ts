export default defineNuxtRouteMiddleware((to) => {
  const { config, isStrictMode, isLayerDefaultDeny } = useRoutingConfig()
  const { resolve } = useFeatures()
  const meta = to.meta

  if (config.debug) console.log('[routing] governance check', to.path, meta)

  // strict default-deny: every route must declare a feature
  if (isStrictMode() && !meta.feature) {
    throw createError({ statusCode: 404 })
  }

  // layer default-deny: layer routes must declare a feature
  if (isLayerDefaultDeny() && meta.__fromLayer && !meta.feature) {
    throw createError({ statusCode: 404 })
  }

  if (!meta.feature) return

  const variant = resolve(meta.feature)
  if (config.debug) console.log(`[routing] feature "${meta.feature}" resolved to "${variant}"`)

  if (variant === 'disabled') throw createError({ statusCode: 404 })
  if (variant === 'beta' || variant === 'coming-soon') return navigateTo('/coming-soon')
})

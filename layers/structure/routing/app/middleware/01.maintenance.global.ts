export default defineNuxtRouteMiddleware((to) => {
  const { isEnabled, allowRoutes } = useMaintenance()
  if (!isEnabled.value) return
  if (allowRoutes.value.some((r) => to.path.startsWith(r))) return
  const target = allowRoutes.value[0]
  // No allowed route to send visitors to: show the maintenance state as an error instead
  if (!target) return abortNavigation(createError({ status: 503 }))
  return navigateTo(target)
})

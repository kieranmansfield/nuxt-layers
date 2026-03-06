export default defineNuxtRouteMiddleware((to) => {
  const { isEnabled, allowRoutes } = useMaintenance()
  if (!isEnabled.value) return
  if (allowRoutes.value.some(r => to.path.startsWith(r))) return
  return navigateTo(allowRoutes.value[0])
})

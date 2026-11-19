export function useMaintenance() {
  const { config } = useRoutingConfig()
  return {
    isEnabled: computed(() => config.maintenance.enabled),
    allowRoutes: computed(() => config.maintenance.allowRoutes),
  }
}

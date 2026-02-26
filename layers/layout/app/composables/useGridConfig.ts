import type { GridConfig, GridLayers, GridMode, GridPresetsItem } from '#layers/layout/app/types/layouts'

interface LayoutLayerConfig {
  layoutLayer?: {
    name?: string
    ui?: {
      grid?: GridConfig
    }
  }
}

export function useGridConfig() {
  const appConfig = useAppConfig() as LayoutLayerConfig
  const gridConfig = computed(() => appConfig.layoutLayer?.ui?.grid)

  /**
   * Resolved layout mode. Derives from `mode` field first, then falls back to
   * the legacy `enabled` boolean for backwards compatibility.
   */
  const mode = computed<GridMode>(() => {
    const cfg = gridConfig.value
    if (!cfg) return 'swiss'
    if (cfg.mode) return cfg.mode
    return cfg.enabled === false ? 'disabled' : 'swiss'
  })

  /** True when the Swiss Grid system is active. */
  const isEnabled = computed(() => mode.value !== 'disabled')

  const getPreset = (name: string): GridPresetsItem | undefined => {
    const presets = gridConfig.value?.presets
    if (!presets) return undefined
    return presets[name as keyof typeof presets]
  }

  /**
   * Returns the z-index value for a named stacking layer.
   *
   * @example
   * const zModal = useZIndex('modal') // → 400
   */
  const useZIndex = (layer: keyof GridLayers): number => {
    return gridConfig.value?.layers?.[layer] ?? 0
  }

  return {
    config: gridConfig,
    getPreset,
    layers: computed(() => gridConfig.value?.layers),
    isEnabled,
    mode,
    useZIndex,
  }
}

import type { GridConfig, GridPresetsItem } from '#layers/layout/app/types/layouts'

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

  /** True when the Swiss Grid system is active (default). Set `layoutLayer.ui.grid.enabled = false` to opt out. */
  const isEnabled = computed(() => gridConfig.value?.enabled ?? true)

  const getPreset = (name: string): GridPresetsItem | undefined => {
    const presets = gridConfig.value?.presets
    if (!presets) return undefined
    return presets[name as keyof typeof presets]
  }

  return {
    config: gridConfig,
    getPreset,
    layers: computed(() => gridConfig.value?.layers),
    isEnabled,
  }
}

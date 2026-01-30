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

  const getPreset = (name: string): GridPresetsItem | undefined => {
    const presets = gridConfig.value?.presets
    if (!presets) return undefined
    return presets[name as keyof typeof presets]
  }

  return {
    config: gridConfig,
    getPreset,
    layers: computed(() => gridConfig.value?.layers),
  }
}

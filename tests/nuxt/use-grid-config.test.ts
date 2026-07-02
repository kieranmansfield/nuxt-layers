import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'

import { useGridConfig } from '../../layers/layout/app/composables/useGridConfig'
import type { GridConfig, GridLayers, GridPresetsItem } from '../../layers/layout/app/types/layouts'

type LayoutAppConfig = {
  layoutLayer?: {
    ui?: {
      grid?: GridConfig
    }
  }
}

const layers: GridLayers = {
  back: 0,
  mid: 10,
  front: 20,
  top: 30,
  header: 100,
  dropdown: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
}

const presets = {
  hero: {
    colSpan: 'full',
    rowSpan: 12,
  },
  prose: {
    colStart: {
      default: 1,
      md: 3,
      lg: 5,
    },
    colSpan: {
      default: 6,
      md: 8,
      lg: 10,
    },
  },
} satisfies Record<string, GridPresetsItem>

var appConfig: LayoutAppConfig = {
  layoutLayer: {
    ui: {
      grid: {
        enabled: false,
        columns: {
          default: 6,
          md: 12,
          lg: 18,
        },
        rowsPerSection: 12,
        rhythm: '0.25rem',
        layers,
        presets,
      },
    },
  },
}

mockNuxtImport('useAppConfig', () => () => appConfig)

async function mountGridConfig() {
  let resolved: ReturnType<typeof useGridConfig> | undefined

  await mountSuspended(
    defineComponent({
      setup() {
        resolved = useGridConfig()
        return () => null
      },
    })
  )

  if (!resolved) {
    throw new Error('grid composable did not resolve')
  }

  return resolved
}

describe('useGridConfig', () => {
  it('uses the legacy enabled flag when mode is omitted', async () => {
    appConfig = {
      layoutLayer: {
        ui: {
          grid: {
            enabled: false,
            columns: {
              default: 6,
              md: 12,
              lg: 18,
            },
            rowsPerSection: 12,
            rhythm: '0.25rem',
            layers,
            presets,
          },
        },
      },
    }

    const resolved = await mountGridConfig()

    expect(resolved.mode.value).toBe('disabled')
    expect(resolved.isEnabled.value).toBe(false)
    expect(resolved.getPreset('hero')).toEqual(presets.hero)
    expect(resolved.getPreset('missing')).toBeUndefined()
    expect(resolved.useZIndex('modal')).toBe(400)
    expect(resolved.layers.value).toEqual(layers)
  })

  it('prefers an explicit mode over the legacy enabled flag', async () => {
    appConfig = {
      layoutLayer: {
        ui: {
          grid: {
            mode: 'fluid',
            enabled: false,
            columns: {
              default: 6,
              md: 12,
              lg: 18,
            },
            rowsPerSection: 16,
            rhythm: '0.5rem',
            layers,
            presets,
          },
        },
      },
    }

    const resolved = await mountGridConfig()

    expect(resolved.mode.value).toBe('fluid')
    expect(resolved.isEnabled.value).toBe(true)
    expect(resolved.useZIndex('toast')).toBe(500)
    expect(resolved.config.value?.rowsPerSection).toBe(16)
  })
})

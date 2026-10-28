<script setup lang="ts">
  import {
    createThemeAuroraColorNode,
    createThemeBubbleColorNode,
    createThemeFlowColorNode,
    createThemeGradientColorNode,
    createThemeLavaLampColorNode,
    createThemePlasmaColorNode,
    createThemeWaveColorNode,
  } from '#layers/shader/app/composables/useAmbientMaterials'
  import type { TSLNode } from '#layers/shader/app/types/tsl'

  import type { ThemePresetProps } from '../../composables/useThemePreset'

  /**
   * One theme-coloured look, picked by `variant` (v7 merged the seven ThemeX preset
   * components). `variant` is read once, when the node graph is built: to switch looks at
   * runtime, give the component a `:key` so it rebuilds. Colours, speed and intensity update
   * live via uniforms.
   */
  type ThemeVariant = 'aurora' | 'bubble' | 'flow' | 'gradient' | 'lava-lamp' | 'plasma' | 'wave'

  const {
    variant = 'gradient',
    speed = 1.0,
    intensity = 1.0,
    mouseInteraction = true,
    mouseStrength = 0.3,
    color1 = '#8b5cf6',
    color2 = '#6366f1',
    color3 = '#a78bfa',
    color4 = '#38bdf8',
  } = defineProps<ThemePresetProps & { variant?: ThemeVariant }>()

  const emit = defineEmits<{
    node: [colorNode: TSLNode]
  }>()

  const VARIANTS = {
    aurora: createThemeAuroraColorNode,
    bubble: createThemeBubbleColorNode,
    flow: createThemeFlowColorNode,
    gradient: createThemeGradientColorNode,
    'lava-lamp': createThemeLavaLampColorNode,
    plasma: createThemePlasmaColorNode,
    wave: createThemeWaveColorNode,
  } satisfies Record<ThemeVariant, unknown>

  const { uniforms, colorNode } = useThemePreset(VARIANTS[variant], {
    get speed() {
      return speed
    },
    get intensity() {
      return intensity
    },
    get mouseInteraction() {
      return mouseInteraction
    },
    get mouseStrength() {
      return mouseStrength
    },
    get color1() {
      return color1
    },
    get color2() {
      return color2
    },
    get color3() {
      return color3
    },
    get color4() {
      return color4
    },
  })

  emit('node', colorNode)
  defineExpose({ uniforms, colorNode })
</script>

<template>
  <slot />
</template>

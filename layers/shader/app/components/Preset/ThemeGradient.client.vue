<script setup lang="ts">
  import { createThemeGradientColorNode } from '#layers/shader/app/composables/useAmbientMaterials'
  import { type ThemePresetProps } from '#layers/shader/app/composables/useThemePreset'
  import type { TSLNode } from '#layers/shader/app/types/tsl'

  const {
    speed = 1.0,
    intensity = 1.0,
    mouseInteraction = true,
    mouseStrength = 0.3,
    color1 = '#8b5cf6',
    color2 = '#6366f1',
    color3 = '#a78bfa',
    color4 = '#38bdf8',
  } = defineProps<ThemePresetProps>()

  const emit = defineEmits<{
    node: [colorNode: TSLNode]
  }>()

  const { uniforms, colorNode } = useThemePreset(createThemeGradientColorNode, {
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

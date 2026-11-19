<script setup lang="ts">
  import { createThemeLavaLampColorNode } from '#layers/shader/app/composables/useAmbientMaterials'
  import { THEME_PRESET_DEFAULTS, type ThemePresetProps } from '../../composables/useThemePreset'
  import type { TSLNode } from '#layers/shader/app/types/tsl'

  // eslint-disable-next-line vue/define-props-destructuring, vue/no-unused-properties -- useThemePreset reads the whole reactive props object
  const props = withDefaults(defineProps<ThemePresetProps>(), THEME_PRESET_DEFAULTS)

  const emit = defineEmits<{
    node: [colorNode: TSLNode]
  }>()

  const { uniforms, colorNode } = useThemePreset(createThemeLavaLampColorNode, props)

  emit('node', colorNode)
  defineExpose({ uniforms, colorNode })
</script>

<template>
  <slot />
</template>

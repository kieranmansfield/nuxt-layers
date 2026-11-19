<script setup lang="ts">
  import { createGradientMeshColorNode } from '#layers/shader/app/composables/useAmbientMaterials'
  import {
    AMBIENT_PRESET_DEFAULTS,
    type AmbientPresetProps,
    useAmbientPreset,
  } from '../../composables/useAmbientPreset'
  import type { TSLNode } from '#layers/shader/app/types/tsl'

  // eslint-disable-next-line vue/define-props-destructuring, vue/no-unused-properties -- useAmbientPreset reads the whole reactive props object
  const props = withDefaults(defineProps<AmbientPresetProps>(), AMBIENT_PRESET_DEFAULTS)

  const emit = defineEmits<{
    node: [colorNode: TSLNode]
  }>()

  const { uniforms, colorNode } = useAmbientPreset(createGradientMeshColorNode, props, 0.3)

  // Emit the node for parent (ShaderHost) to consume
  emit('node', colorNode)
  defineExpose({ uniforms, colorNode })
</script>

<template>
  <slot />
</template>

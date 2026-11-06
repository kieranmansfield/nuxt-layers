<script setup lang="ts">
  import {
    createAmbientUniforms,
    createAuroraColorNode,
  } from '#layers/shader/app/composables/useAmbientMaterials'
  import type { TSLNode } from '#layers/shader/app/types/tsl'

  const {
    speed = 1.0,
    intensity = 1.0,
    mouseInteraction = true,
  } = defineProps<{
    speed?: number
    intensity?: number
    mouseInteraction?: boolean
  }>()

  const emit = defineEmits<{
    node: [colorNode: TSLNode]
  }>()

  // Create uniforms once
  const uniforms = createAmbientUniforms({ speed, intensity, mouseInteraction })

  // Build the TSL color node (references uniforms by pointer)
  const colorNode = createAuroraColorNode(uniforms)

  useAmbientControls(
    uniforms,
    {
      speed: () => speed,
      intensity: () => intensity,
      mouseInteraction: () => mouseInteraction,
    },
    0.5
  )

  // Emit the node for parent (ShaderHost) to consume
  emit('node', colorNode)

  defineExpose({ uniforms, colorNode })
</script>

<template>
  <slot />
</template>

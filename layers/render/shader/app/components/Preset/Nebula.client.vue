<script setup lang="ts">
  import {
    createAmbientUniforms,
    createNebulaColorNode,
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

  const uniforms = createAmbientUniforms({
    speed: speed,
    intensity: intensity,
    mouseInteraction: mouseInteraction,
  })

  const colorNode = createNebulaColorNode(uniforms)

  useAmbientControls(
    uniforms,
    {
      speed: () => speed,
      intensity: () => intensity,
      mouseInteraction: () => mouseInteraction,
    },
    0.3
  )

  emit('node', colorNode)

  defineExpose({ uniforms, colorNode })
</script>

<template>
  <slot />
</template>

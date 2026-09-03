<script setup lang="ts">
  import {
    createAmbientUniforms,
    createFlowColorNode,
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

  const colorNode = createFlowColorNode(uniforms)

  try {
    const runtime = useShaderRuntimeContext()
    watch(
      () => [runtime.mouse.mouseX.value, runtime.mouse.mouseY.value],
      ([mx, my]) => {
        uniforms.mouseX.value = mx ?? 0.5
        uniforms.mouseY.value = my ?? 0.5
      },
      { immediate: true }
    )
  } catch {
    // No runtime
  }

  watch(
    () => speed,
    (v) => {
      uniforms.speed.value = v
    }
  )
  watch(
    () => intensity,
    (v) => {
      uniforms.intensity.value = v
    }
  )
  watch(
    () => mouseInteraction,
    (v) => {
      uniforms.mouseStrength.value = v ? 0.5 : 0
    }
  )

  emit('node', colorNode)

  defineExpose({ uniforms, colorNode })
</script>

<template>
  <slot />
</template>

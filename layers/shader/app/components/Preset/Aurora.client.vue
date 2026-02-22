<script setup lang="ts">
// @ts-nocheck - TSL types
import { uniform } from 'three/tsl'
import {
  createAmbientUniforms,
  createAuroraColorNode,
} from '#layers/shader/app/composables/useAmbientMaterials'

const props = withDefaults(
  defineProps<{
    speed?: number
    intensity?: number
    mouseInteraction?: boolean
  }>(),
  {
    speed: 1.0,
    intensity: 1.0,
    mouseInteraction: true,
  }
)

const emit = defineEmits<{
  node: [colorNode: any]
}>()

// Create uniforms once
const uniforms = createAmbientUniforms({
  speed: props.speed,
  intensity: props.intensity,
  mouseInteraction: props.mouseInteraction,
})

// Build the TSL color node (references uniforms by pointer)
const colorNode = createAuroraColorNode(uniforms)

// Wire mouse from runtime if available
try {
  const runtime = useShaderRuntimeContext()
  watch(
    () => [runtime.mouse.mouseX.value, runtime.mouse.mouseY.value],
    ([mx, my]) => {
      uniforms.mouseX.value = mx
      uniforms.mouseY.value = my
    },
    { immediate: true }
  )
} catch {
  // No runtime -- mouse can be set externally
}

// Watch props to update uniforms (no recompilation)
watch(() => props.speed, (v) => { uniforms.speed.value = v })
watch(() => props.intensity, (v) => { uniforms.intensity.value = v })
watch(
  () => props.mouseInteraction,
  (v) => { uniforms.mouseStrength.value = v ? 0.5 : 0 }
)

// Emit the node for parent (ShaderHost) to consume
emit('node', colorNode)

defineExpose({ uniforms, colorNode })
</script>

<template>
  <slot />
</template>

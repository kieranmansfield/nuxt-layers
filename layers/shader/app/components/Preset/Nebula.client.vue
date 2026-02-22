<script setup lang="ts">
// @ts-nocheck - TSL types
import {
  createAmbientUniforms,
  createNebulaColorNode,
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

const uniforms = createAmbientUniforms({
  speed: props.speed,
  intensity: props.intensity,
  mouseInteraction: props.mouseInteraction,
})

const colorNode = createNebulaColorNode(uniforms)

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
  // No runtime
}

watch(() => props.speed, (v) => { uniforms.speed.value = v })
watch(() => props.intensity, (v) => { uniforms.intensity.value = v })
watch(
  () => props.mouseInteraction,
  (v) => { uniforms.mouseStrength.value = v ? 0.3 : 0 }
)

emit('node', colorNode)

defineExpose({ uniforms, colorNode })
</script>

<template>
  <slot />
</template>

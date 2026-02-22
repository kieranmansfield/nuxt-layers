<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    speed?: number
    accentColor?: string
    darkMode?: boolean
    mouseSmoothing?: number
  }>(),
  {
    speed: 1.0,
    accentColor: '#8b5cf6',
    darkMode: true,
    mouseSmoothing: 0.1,
  }
)

const runtime = useShaderRuntime({
  speed: props.speed,
  accentColor: props.accentColor,
  darkMode: props.darkMode,
  mouseSmoothing: props.mouseSmoothing,
})

// Watch props and update runtime uniforms
watch(
  () => props.speed,
  (val) => runtime.time.setSpeed(val)
)

watch(
  () => props.accentColor,
  (val) => {
    runtime.accentColor.value = val
  }
)

watch(
  () => props.darkMode,
  (val) => {
    runtime.darkMode.value = val
  }
)
</script>

<template>
  <slot />
</template>

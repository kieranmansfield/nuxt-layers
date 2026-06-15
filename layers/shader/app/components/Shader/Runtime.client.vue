<script setup lang="ts">
  const {
    speed = 1.0,
    accentColor = '#8b5cf6',
    darkMode = true,
    mouseSmoothing = 0.1,
  } = defineProps<{
    speed?: number
    accentColor?: string
    darkMode?: boolean
    mouseSmoothing?: number
  }>()

  const runtime = useShaderRuntime({ speed, accentColor, darkMode, mouseSmoothing })

  // Watch props and update runtime uniforms
  watch(
    () => speed,
    (val) => runtime.time.setSpeed(val)
  )

  watch(
    () => accentColor,
    (val) => {
      runtime.accentColor.value = val
    }
  )

  watch(
    () => darkMode,
    (val) => {
      runtime.darkMode.value = val
    }
  )
</script>

<template>
  <slot />
</template>

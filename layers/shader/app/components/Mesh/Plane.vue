<script setup lang="ts">
  const {
    width = 2,
    height = 2,
    widthSegments = 1,
    heightSegments = 1,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
  } = defineProps<{
    width?: number
    height?: number
    widthSegments?: number
    heightSegments?: number
    position?: [number, number, number]
    rotation?: [number, number, number]
  }>()
</script>

<template>
  <TresMesh :position :rotation>
    <TresPlaneGeometry :args="[width, height, widthSegments, heightSegments]" />
    <slot />
  </TresMesh>
</template>

<script setup lang="ts">
  import type { Vector3 } from 'three'

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
  <TresMesh :position="position as unknown as Vector3" :rotation="rotation as unknown as Vector3">
    <TresPlaneGeometry :args="[width, height, widthSegments, heightSegments]" />
    <slot />
  </TresMesh>
</template>

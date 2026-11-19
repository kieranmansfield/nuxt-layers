<script setup lang="ts">
  import { uniform } from 'three/tsl'

  import { rotateUV } from '../../shaders/common/uv'

  const {
    angle = 0,
    pivotX = 0.5,
    pivotY = 0.5,
    order = 0,
  } = defineProps<{
    /** Rotation in degrees */
    angle?: number
    pivotX?: number
    pivotY?: number
    order?: number
  }>()

  const angleNode = uniform(angle * (Math.PI / 180))
  watch(
    () => angle,
    (v) => {
      angleNode.value = v * (Math.PI / 180)
    }
  )

  useShaderStage((uvIn) => rotateUV(uvIn, angleNode, [pivotX, pivotY]), order, 'uv')
</script>

<template>
  <slot />
</template>

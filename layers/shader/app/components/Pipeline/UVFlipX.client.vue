<script setup lang="ts">
// @ts-nocheck
import { float, vec2 } from 'three/tsl'

const { order = 0 } = defineProps<{ order?: number }>()

useShaderStage(
  (uvIn) => vec2(float(1).sub(uvIn.x), uvIn.y),
  order,
  'uv',
)
</script>

<template><!-- --></template>

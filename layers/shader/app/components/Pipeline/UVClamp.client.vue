<script setup lang="ts">
// @ts-nocheck
import { clamp, vec2, float } from 'three/tsl'

/**
 * Clamps UV to [0, 1] — prevents tiling/repeat artefacts at the edges.
 * Equivalent to CSS background-repeat: no-repeat.
 */
const { order = 0 } = defineProps<{ order?: number }>()

useShaderStage(
  (uvIn) => vec2(clamp(uvIn.x, float(0), float(1)), clamp(uvIn.y, float(0), float(1))),
  order,
  'uv',
)
</script>

<template><!-- --></template>

<script setup lang="ts">
// @ts-nocheck
import { vec4 } from 'three/tsl'

/**
 * Sets alpha to max(r, g, b) — the ColorBends transparent mode pattern.
 * Shaders that generate shape from colour intensity (bright = opaque, dark = transparent)
 * should use this instead of a fixed alpha = 1.
 */
const { order = 0 } = defineProps<{ order?: number }>()

useShaderStage(
  (prev) => vec4(prev.xyz, prev.x.max(prev.y).max(prev.z)),
  order,
)
</script>

<template><!-- --></template>

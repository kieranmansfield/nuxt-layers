<script setup lang="ts">
// @ts-nocheck
import { vec4 } from 'three/tsl'
import { reinhardTonemap } from '../../shaders/common/tonemapping'

/**
 * Simple Reinhard tone mapping: col / (col + 1).
 * Compresses HDR values with no hard clip — highlights desaturate toward white.
 */
const { order = 0 } = defineProps<{ order?: number }>()

useShaderStage(
  (prev) => vec4(reinhardTonemap(prev.xyz), prev.w),
  order,
)
</script>

<template><!-- --></template>

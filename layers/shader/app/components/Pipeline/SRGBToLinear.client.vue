<script setup lang="ts">
// @ts-nocheck
import { uniform, vec4, pow, float } from 'three/tsl'

/**
 * Decodes sRGB to linear light — the inverse of LinearToSRGB.
 * Apply before any physically-based blending or tonemapping.
 * Approximate form: pow(col, 2.2).
 */
const props = withDefaults(defineProps<{
  /** Gamma exponent — 2.2 matches sRGB standard */
  gamma?: number
  order?: number
}>(), { gamma: 2.2, order: 0 })

const gammaNode = uniform(props.gamma)
watch(() => props.gamma, v => { gammaNode.value = v })

useShaderStage(
  (prev) => vec4(pow(prev.xyz.max(float(0)), gammaNode), prev.w),
  props.order,
)
</script>

<template><!-- --></template>

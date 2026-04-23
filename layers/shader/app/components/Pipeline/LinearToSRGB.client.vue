<script setup lang="ts">
// @ts-nocheck
import { uniform, vec4, pow, float } from 'three/tsl'

/**
 * Gamma-encodes linear light to sRGB for display.
 * Use as the last step in HDR pipelines before output.
 * Approximate form: pow(col, 1/2.2).
 */
const props = withDefaults(defineProps<{
  /** Gamma exponent — 2.2 matches sRGB standard */
  gamma?: number
  order?: number
}>(), { gamma: 2.2, order: 0 })

const gammaNode = uniform(props.gamma)
watch(() => props.gamma, v => { gammaNode.value = v })

useShaderStage(
  (prev) => vec4(pow(prev.xyz.max(float(0)), float(1).div(gammaNode)), prev.w),
  props.order,
)
</script>

<template><!-- --></template>

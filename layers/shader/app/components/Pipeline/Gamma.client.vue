<script setup lang="ts">
// @ts-nocheck
import { uniform, vec4, pow, float } from 'three/tsl'

const props = withDefaults(defineProps<{
  /** Gamma value: 1 = unchanged, 2.2 = standard display gamma */
  gamma?: number
  order?: number
}>(), { gamma: 2.2, order: 0 })

const gammaNode = uniform(props.gamma)
watch(() => props.gamma, v => { gammaNode.value = v })

useShaderStage(
  (prev) => {
    const corrected = pow(prev.xyz.max(float(0)), float(1).div(gammaNode))
    return vec4(corrected, prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>

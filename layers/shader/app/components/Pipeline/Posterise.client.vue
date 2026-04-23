<script setup lang="ts">
// @ts-nocheck
import { uniform, vec4, floor, float } from 'three/tsl'

const props = withDefaults(defineProps<{
  /** Number of colour steps per channel */
  steps?: number
  order?: number
}>(), { steps: 6, order: 0 })

const stepsNode = uniform(props.steps)
watch(() => props.steps, v => { stepsNode.value = v })

useShaderStage(
  (prev) => {
    const posterised = floor(prev.xyz.mul(stepsNode)).div(stepsNode.sub(float(1)))
    return vec4(posterised, prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>

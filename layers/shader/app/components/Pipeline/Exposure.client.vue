<script setup lang="ts">
// @ts-nocheck
import { uniform, vec4, pow, float } from 'three/tsl'

const props = withDefaults(defineProps<{
  /** Exposure in stops: 0 = unchanged, +1 = 2× brighter, -1 = 2× darker */
  stops?: number
  order?: number
}>(), { stops: 0, order: 0 })

const stopsNode = uniform(props.stops)
watch(() => props.stops, v => { stopsNode.value = v })

useShaderStage(
  (prev) => {
    const scale = pow(float(2), stopsNode)
    return vec4(prev.xyz.mul(scale), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>

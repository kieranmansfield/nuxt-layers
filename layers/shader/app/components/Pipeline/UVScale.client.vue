<script setup lang="ts">
// @ts-nocheck
import { uniform } from 'three/tsl'

const props = withDefaults(defineProps<{
  scale?: number
  pivotX?: number
  pivotY?: number
  order?: number
}>(), {
  scale: 1,
  pivotX: 0.5,
  pivotY: 0.5,
  order: 0,
})

const scaleNode = uniform(props.scale)
watch(() => props.scale, v => { scaleNode.value = v })

useShaderStage(
  (uvIn) => {
    const pivot = vec2(props.pivotX, props.pivotY)
    return uvIn.sub(pivot).div(scaleNode).add(pivot)
  },
  props.order,
  'uv',
)
</script>

<template><!-- --></template>

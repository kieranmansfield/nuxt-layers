<script setup lang="ts">
// @ts-nocheck
import { Vector2 } from 'three'
import { time, uniform } from 'three/tsl'

const props = withDefaults(defineProps<{
  speedX?: number
  speedY?: number
  order?: number
}>(), {
  speedX: 0,
  speedY: 0.1,
  order: 0,
})

const speedVal = new Vector2(props.speedX, props.speedY)
const speedNode = uniform(speedVal)
watch(() => [props.speedX, props.speedY], ([x, y]) => { speedNode.value.set(x, y) })

useShaderStage(
  (uvIn) => uvIn.add(speedNode.mul(time)).fract(),
  props.order,
  'uv',
)
</script>

<template><!-- --></template>

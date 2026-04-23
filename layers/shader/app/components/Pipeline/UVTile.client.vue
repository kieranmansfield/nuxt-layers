<script setup lang="ts">
// @ts-nocheck
import { Vector2 } from 'three'
import { uniform } from 'three/tsl'

const props = withDefaults(defineProps<{
  repeatX?: number
  repeatY?: number
  order?: number
}>(), {
  repeatX: 2,
  repeatY: 2,
  order: 0,
})

const repeatVal = new Vector2(props.repeatX, props.repeatY)
const repeatNode = uniform(repeatVal)
watch(() => [props.repeatX, props.repeatY], ([x, y]) => { repeatNode.value.set(x, y) })

useShaderStage(
  (uvIn) => uvIn.mul(repeatNode).fract(),
  props.order,
  'uv',
)
</script>

<template><!-- --></template>

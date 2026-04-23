<script setup lang="ts">
// @ts-nocheck
import { uniform, vec4 } from 'three/tsl'
import { hueShift } from '../../shaders/common/palette'

const props = withDefaults(defineProps<{
  /** Hue shift amount in [0, 1] (1 = full rotation) */
  shift?: number
  order?: number
}>(), { shift: 0, order: 0 })

const shiftNode = uniform(props.shift)
watch(() => props.shift, v => { shiftNode.value = v })

useShaderStage(
  (prev) => vec4(hueShift(prev.xyz, shiftNode), prev.w),
  props.order,
)
</script>

<template><!-- --></template>

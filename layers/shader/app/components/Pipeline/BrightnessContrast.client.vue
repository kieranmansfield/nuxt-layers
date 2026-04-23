<script setup lang="ts">
// @ts-nocheck
import { uniform, vec4 } from 'three/tsl'
import { brightness, contrast } from '../../shaders/common/blend'

const props = withDefaults(defineProps<{
  /** Additive brightness offset: 0 = unchanged, positive = brighter */
  brightness?: number
  /** Contrast multiplier: 1 = unchanged, >1 = more contrast */
  contrast?: number
  order?: number
}>(), { brightness: 0, contrast: 1, order: 0 })

const brightnessNode = uniform(props.brightness)
const contrastNode = uniform(props.contrast)
watch(() => props.brightness, v => { brightnessNode.value = v })
watch(() => props.contrast, v => { contrastNode.value = v })

useShaderStage(
  (prev) => vec4(brightness(contrast(prev.xyz, contrastNode), brightnessNode), prev.w),
  props.order,
)
</script>

<template><!-- --></template>

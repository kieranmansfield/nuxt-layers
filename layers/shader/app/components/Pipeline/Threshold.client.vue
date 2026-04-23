<script setup lang="ts">
// @ts-nocheck
import { uniform, vec4, step, float } from 'three/tsl'
import { luminance } from '../../shaders/common/blend'

const props = withDefaults(defineProps<{
  /** Luminance threshold 0–1: below = black, above = white */
  threshold?: number
  order?: number
}>(), { threshold: 0.5, order: 0 })

const thresholdNode = uniform(props.threshold)
watch(() => props.threshold, v => { thresholdNode.value = v })

useShaderStage(
  (prev) => {
    const lum = luminance(prev.xyz)
    const t = step(thresholdNode, lum)
    return vec4(float(t), float(t), float(t), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>

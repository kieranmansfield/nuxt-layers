<script setup lang="ts">
// @ts-nocheck
import { uniform, vec4, clamp } from 'three/tsl'

const props = withDefaults(defineProps<{
  /** Number of bands across the UV Y axis */
  frequency?: number
  /** Brightness addend at band peaks */
  scale?: number
  order?: number
}>(), { frequency: 8, scale: 0.15, order: 0 })

const freqNode = uniform(props.frequency)
const scaleNode = uniform(props.scale)
watch(() => props.frequency, v => { freqNode.value = v })
watch(() => props.scale, v => { scaleNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uvCurrent = pipeline.uvNode.value
    const band = uvCurrent.y.mul(freqNode).fract().mul(scaleNode)
    const rgb = clamp(prev.xyz.add(band), 0, 1)
    return vec4(rgb, prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>

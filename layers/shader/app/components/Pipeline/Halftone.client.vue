<script setup lang="ts">
// @ts-nocheck
import { uniform, vec4 } from 'three/tsl'
import { halftone } from '../../shaders/common/grain'
import { luminance } from '../../shaders/common/blend'

const props = withDefaults(defineProps<{
  /** Dot density — higher = finer dots */
  scale?: number
  /** Screen angle in radians */
  angle?: number
  order?: number
}>(), { scale: 50, angle: 0, order: 0 })

const scaleNode = uniform(props.scale)
const angleNode = uniform(props.angle)
watch(() => props.scale, v => { scaleNode.value = v })
watch(() => props.angle, v => { angleNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uvCurrent = pipeline.uvNode.value
    const lum = luminance(prev.xyz)
    const dot = halftone(uvCurrent, lum, scaleNode, angleNode)
    return vec4(prev.xyz.mul(dot), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>

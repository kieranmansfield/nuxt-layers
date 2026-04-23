<script setup lang="ts">
// @ts-nocheck
import { clamp, time, uniform, vec4 } from 'three/tsl'
import { animatedGrain, grain } from '../../shaders/common/grain'

const props = withDefaults(defineProps<{
  intensity?: number
  animated?: boolean
  /** Frames per second for grain animation (animated only) */
  fps?: number
  order?: number
}>(), {
  intensity: 0.05,
  animated: true,
  fps: 24,
  order: 0,
})

const intensityNode = uniform(props.intensity)
const fpsNode = uniform(props.fps)
watch(() => props.intensity, v => { intensityNode.value = v })
watch(() => props.fps, v => { fpsNode.value = v })

const { uvNode } = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const g = props.animated
      ? animatedGrain(uvNode.value, time, intensityNode, fpsNode)
      : grain(uvNode.value, intensityNode)
    return clamp(vec4(prev.xyz.add(g), prev.w), 0, 1)
  },
  props.order,
)
</script>

<template><!-- --></template>

<script setup lang="ts">
// @ts-nocheck
import { uniform, vec4 } from 'three/tsl'
import { vignette } from '../../shaders/common/grain'

const props = withDefaults(defineProps<{
  intensity?: number
  smoothness?: number
  order?: number
}>(), {
  intensity: 0.5,
  smoothness: 0.5,
  order: 0,
})

const intensityNode = uniform(props.intensity)
const smoothnessNode = uniform(props.smoothness)
watch(() => props.intensity, v => { intensityNode.value = v })
watch(() => props.smoothness, v => { smoothnessNode.value = v })

const { uvNode } = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const v = vignette(uvNode.value, intensityNode, smoothnessNode)
    return vec4(prev.xyz.mul(v), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>

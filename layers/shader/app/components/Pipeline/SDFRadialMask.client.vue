<script setup lang="ts">
// @ts-nocheck
import { uniform, vec4, float } from 'three/tsl'

const props = withDefaults(defineProps<{
  /** Scale factor for the radial distance — larger = tighter mask */
  scale?: number
  /** Softness of the mask edge */
  softness?: number
  order?: number
}>(), { scale: 1.5, softness: 0.2, order: 0 })

const scaleNode = uniform(props.scale)
const softnessNode = uniform(props.softness)
watch(() => props.scale, v => { scaleNode.value = v })
watch(() => props.softness, v => { softnessNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uvCurrent = pipeline.uvNode.value
    const dist = uvCurrent.sub(0.5).mul(scaleNode).length()
    const mask = float(1).sub(dist).sub(softnessNode).max(0).div(float(1).sub(softnessNode))
    return vec4(prev.xyz, prev.w.mul(mask))
  },
  props.order,
)
</script>

<template><!-- --></template>

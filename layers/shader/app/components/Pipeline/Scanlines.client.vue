<script setup lang="ts">
// @ts-nocheck
import { uniform, vec4, time } from 'three/tsl'
import { scanlines } from '../../shaders/common/grain'

const props = withDefaults(defineProps<{
  /** Number of scanlines across the screen */
  density?: number
  /** Darkness of the lines: 0 = invisible, 1 = full black */
  intensity?: number
  /** Animate the lines — speed in lines/second */
  scrollSpeed?: number
  order?: number
}>(), { density: 400, intensity: 0.25, scrollSpeed: 0, order: 0 })

const densityNode = uniform(props.density)
const intensityNode = uniform(props.intensity)
const scrollSpeedNode = uniform(props.scrollSpeed)
watch(() => props.density, v => { densityNode.value = v })
watch(() => props.intensity, v => { intensityNode.value = v })
watch(() => props.scrollSpeed, v => { scrollSpeedNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uvCurrent = pipeline.uvNode.value
    const offset = time.mul(scrollSpeedNode)
    const factor = scanlines(uvCurrent, densityNode, intensityNode, offset)
    return vec4(prev.xyz.mul(factor), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>

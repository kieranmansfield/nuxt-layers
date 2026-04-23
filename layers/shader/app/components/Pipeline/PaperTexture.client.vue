<script setup lang="ts">
// @ts-nocheck
import { uniform, time, vec4, floor, float } from 'three/tsl'
import { paperTexture } from '../../shaders/common/grain'

/**
 * Paper texture overlay — multi-octave grain that reads like coarse paper or canvas.
 * Adds tactile analogue feel to any underlying image.
 */
const props = withDefaults(defineProps<{
  /** Texture scale — higher = finer grain pattern */
  scale?: number
  /** Overlay intensity */
  intensity?: number
  /** Animate slowly for a living-paper effect (0 = static) */
  speed?: number
  order?: number
}>(), { scale: 12, intensity: 0.08, speed: 0, order: 0 })

const scaleNode = uniform(props.scale)
const intensityNode = uniform(props.intensity)
const speedNode = uniform(props.speed)
watch(() => props.scale, v => { scaleNode.value = v })
watch(() => props.intensity, v => { intensityNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uv = pipeline.uvNode.value
    const seed = floor(time.mul(speedNode).mul(6))

    const tex = paperTexture(uv, scaleNode, intensityNode, seed)
    return vec4(prev.xyz.add(tex), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>

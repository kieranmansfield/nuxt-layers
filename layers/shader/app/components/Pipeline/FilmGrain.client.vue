<script setup lang="ts">
// @ts-nocheck
import { uniform, time, vec2, vec4, clamp } from 'three/tsl'

/**
 * Hash-based film grain — coarser and more organic than the sin/dot pattern.
 * Darkens rather than brightens, matching the Shadertoy snippet 4 pattern.
 * Formula: filmGrainNoise = length(hash(vec2(uv.x + t, uv.y + t)))
 */
const props = withDefaults(defineProps<{
  /** Grain intensity: 0 = none, 1 = strong */
  intensity?: number
  /** Grain animation frame rate (fps) */
  fps?: number
  order?: number
}>(), { intensity: 0.05, fps: 24, order: 0 })

const intensityNode = uniform(props.intensity)
const fpsNode = uniform(props.fps)
watch(() => props.intensity, v => { intensityNode.value = v })
watch(() => props.fps, v => { fpsNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uvCurrent = pipeline.uvNode.value
    // Quantise time to fps to create frame-locked grain flicker
    const t = time.mul(fpsNode).floor().div(fpsNode)

    // Two-pass hash: sin(dot(uv + t, k)) pattern with length for coarser texture
    const k1 = vec2(127.1, 311.7)
    const k2 = vec2(269.5, 183.3)
    const p = uvCurrent.add(t)
    const h1 = p.dot(k1).sin().mul(43758.5453).fract()
    const h2 = p.add(t.mul(0.3)).dot(k2).sin().mul(43758.5453).fract()
    const noise = vec2(h1, h2).length().mul(intensityNode)

    return vec4(clamp(prev.xyz.sub(noise), 0, 1), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>

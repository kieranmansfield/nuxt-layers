<script setup lang="ts">
// @ts-nocheck
import { uniform, time, vec3, vec4, vec2, floor, fract, sin, dot, smoothstep, float } from 'three/tsl'

/**
 * Hash-based procedural starfield.
 * Each cell on a grid may contain a star whose brightness twinkles over time.
 */
const props = withDefaults(defineProps<{
  /** Grid density — higher = more stars */
  density?: number
  /** Star brightness */
  brightness?: number
  /** Twinkle animation speed */
  twinkleSpeed?: number
  /** Star size (sharpness) */
  size?: number
  order?: number
}>(), { density: 80, brightness: 1.0, twinkleSpeed: 1.0, size: 0.4, order: 0 })

const densityNode = uniform(props.density)
const brightnessNode = uniform(props.brightness)
const twinkleNode = uniform(props.twinkleSpeed)
const sizeNode = uniform(props.size)
watch(() => props.density, v => { densityNode.value = v })
watch(() => props.brightness, v => { brightnessNode.value = v })
watch(() => props.twinkleSpeed, v => { twinkleNode.value = v })
watch(() => props.size, v => { sizeNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uv = pipeline.uvNode.value
    const t = time.mul(twinkleNode)

    // Scale UV into grid cells
    const scaled = uv.mul(densityNode)
    const cell = floor(scaled)
    const local = fract(scaled).sub(0.5)

    // Hash per cell → star position offset and brightness
    const h1 = fract(sin(dot(cell, vec2(127.1, 311.7))).mul(43758.5453))
    const h2 = fract(sin(dot(cell, vec2(269.5, 183.3))).mul(43758.5453))
    const h3 = fract(sin(dot(cell, vec2(419.2, 371.9))).mul(43758.5453))

    // Only ~30% of cells have stars
    const hasStar = smoothstep(0.7, 0.75, h3)

    // Star position within cell
    const starPos = vec2(h1, h2).sub(0.5).mul(0.6)
    const dist = local.sub(starPos).length()

    // Twinkle via time-based sine modulation
    const twinkle = sin(t.add(h1.mul(6.28))).mul(0.3).add(0.7)
    const star = smoothstep(sizeNode, float(0), dist.mul(10)).mul(hasStar).mul(twinkle)

    const colour = vec3(star.mul(brightnessNode))
    return vec4(prev.xyz.add(colour), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>

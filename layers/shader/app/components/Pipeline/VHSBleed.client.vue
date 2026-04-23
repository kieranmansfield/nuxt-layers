<script setup lang="ts">
// @ts-nocheck
import { uniform, time, vec3, vec4, sin, floor, fract, float } from 'three/tsl'

/**
 * VHS colour bleed + horizontal noise drift.
 * Shifts R/B channels horizontally by a noise-driven amount and adds scanline banding.
 */
const props = withDefaults(defineProps<{
  /** Channel bleed strength */
  bleedStrength?: number
  /** Horizontal noise frequency */
  noiseFreq?: number
  /** Tracking error intensity */
  trackingNoise?: number
  /** Animation speed */
  speed?: number
  order?: number
}>(), { bleedStrength: 0.015, noiseFreq: 8, trackingNoise: 0.3, speed: 1, order: 0 })

const bleedNode = uniform(props.bleedStrength)
const noiseFreqNode = uniform(props.noiseFreq)
const trackingNode = uniform(props.trackingNoise)
const speedNode = uniform(props.speed)
watch(() => props.bleedStrength, v => { bleedNode.value = v })
watch(() => props.noiseFreq, v => { noiseFreqNode.value = v })
watch(() => props.trackingNoise, v => { trackingNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uv = pipeline.uvNode.value
    const t = time.mul(speedNode)

    // Horizontal tracking noise — quantised to simulate tape jitter
    const scanLine = floor(uv.y.mul(noiseFreqNode))
    const jitter = fract(sin(scanLine.add(t.mul(7.1731)).mul(43758.5453))).sub(0.5)
    const drift = jitter.mul(trackingNode).mul(bleedNode)

    // Channel separation: R shifts right, B shifts left relative to G
    const rBleed = fract(prev.r.add(drift))
    const bBleed = fract(prev.b.sub(drift))

    // Scanline brightness variation
    const scanBrightness = sin(uv.y.mul(400).add(t.mul(3))).mul(0.03).add(1)

    return vec4(
      vec3(rBleed, prev.g, bBleed).mul(scanBrightness),
      prev.w,
    )
  },
  props.order,
)
</script>

<template><!-- --></template>

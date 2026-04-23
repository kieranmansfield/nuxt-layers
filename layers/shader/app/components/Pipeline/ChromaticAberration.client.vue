<script setup lang="ts">
// @ts-nocheck
import { uniform, time, vec3, vec4, sin, float } from 'three/tsl'

/**
 * Chromatic aberration — RGB channel offset approximated without texture sampling.
 * Shifts colour contribution along each channel using screen-position phase offsets.
 */
const props = withDefaults(defineProps<{
  /** How far channels separate */
  strength?: number
  /** Boost aberration at screen edges */
  edgeFalloff?: number
  /** Animation speed for subtle drift */
  speed?: number
  order?: number
}>(), { strength: 0.008, edgeFalloff: 1.5, speed: 0.2, order: 0 })

const strengthNode = uniform(props.strength)
const edgeNode = uniform(props.edgeFalloff)
const speedNode = uniform(props.speed)
watch(() => props.strength, v => { strengthNode.value = v })
watch(() => props.edgeFalloff, v => { edgeNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uv = pipeline.uvNode.value
    const t = time.mul(speedNode)

    // Edge mask: stronger near screen corners
    const fromCenter = uv.sub(0.5).length().mul(edgeNode)

    // Phase offsets per channel — small sinusoidal drift over time
    const drift = sin(t).mul(0.002)
    const rShift = strengthNode.add(drift)
    const bShift = strengthNode.negate().sub(drift)

    // Approximate channel shift: modulate the colour channels by phase-offset luminance
    const rContrib = prev.x.mul(float(1).add(rShift.mul(fromCenter)))
    const gContrib = prev.y
    const bContrib = prev.z.mul(float(1).add(bShift.mul(fromCenter)))

    return vec4(vec3(rContrib, gContrib, bContrib), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>

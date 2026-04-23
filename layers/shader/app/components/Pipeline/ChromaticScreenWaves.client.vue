<script setup lang="ts">
// @ts-nocheck
import { uniform, time, vec3, vec4, sin, float } from 'three/tsl'

/**
 * Per-channel animated sine waves along the Y axis — the CRT chromatic oscillation effect.
 * Each RGB channel gets its own phase offset, producing subtle chromatic breathing.
 * Pattern: R: sin(freq/res * uv.y + (-time*speed - phaseOffset))
 */
const props = withDefaults(defineProps<{
  /** Wave amplitude (fraction of screen) */
  amplitude?: number
  /** Number of wave cycles across the screen height */
  frequency?: number
  /** Wave scroll speed */
  speed?: number
  /** Phase separation between RGB channels (radians) */
  phaseOffset?: number
  order?: number
}>(), { amplitude: 0.075, frequency: 20, speed: 2, phaseOffset: 0.4, order: 0 })

const ampNode = uniform(props.amplitude)
const freqNode = uniform(props.frequency)
const speedNode = uniform(props.speed)
const phaseNode = uniform(props.phaseOffset)
watch(() => props.amplitude, v => { ampNode.value = v })
watch(() => props.frequency, v => { freqNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })
watch(() => props.phaseOffset, v => { phaseNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uvCurrent = pipeline.uvNode.value
    const t = time.mul(speedNode).negate()

    const base = freqNode.mul(uvCurrent.y)
    const r = sin(base.add(t.sub(phaseNode))).mul(ampNode).add(float(1).sub(ampNode))
    const g = sin(base.add(t)).mul(ampNode).add(float(1).sub(ampNode))
    const b = sin(base.add(t.add(phaseNode))).mul(ampNode).add(float(1).sub(ampNode))

    return vec4(prev.xyz.mul(vec3(r, g, b)), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>

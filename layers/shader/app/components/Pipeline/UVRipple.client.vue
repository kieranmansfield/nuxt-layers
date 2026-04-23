<script setup lang="ts">
// @ts-nocheck
import { uniform, time } from 'three/tsl'
import { rippleUV } from '../../shaders/common/uv'

const props = withDefaults(defineProps<{
  /** Ripple frequency */
  frequency?: number
  /** Ripple amplitude */
  amplitude?: number
  /** Falloff rate from center */
  falloff?: number
  /** Animation speed */
  speed?: number
  order?: number
}>(), { frequency: 10, amplitude: 0.05, falloff: 1, speed: 1, order: 0 })

const freqNode = uniform(props.frequency)
const ampNode = uniform(props.amplitude)
const falloffNode = uniform(props.falloff)
const speedNode = uniform(props.speed)
watch(() => props.frequency, v => { freqNode.value = v })
watch(() => props.amplitude, v => { ampNode.value = v })
watch(() => props.falloff, v => { falloffNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })

useShaderStage(
  (uvIn) => rippleUV(uvIn, [0.5, 0.5], freqNode, ampNode, time.mul(speedNode), falloffNode),
  props.order,
  'uv',
)
</script>

<template><!-- --></template>

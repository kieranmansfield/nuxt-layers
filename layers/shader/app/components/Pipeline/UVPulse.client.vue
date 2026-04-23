<script setup lang="ts">
// @ts-nocheck
import { uniform, time, vec2, sin, float } from 'three/tsl'

/**
 * Oscillating UV scale over time — the UV breathes in and out.
 * scale = 1 + sin(time * speed) * amount
 */
const props = withDefaults(defineProps<{
  /** Pulse amplitude (fraction of UV range) */
  amount?: number
  /** Pulse speed in radians per second */
  speed?: number
  order?: number
}>(), { amount: 0.1, speed: 2, order: 0 })

const amountNode = uniform(props.amount)
const speedNode = uniform(props.speed)
watch(() => props.amount, v => { amountNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })

useShaderStage(
  (uvIn) => {
    const scale = float(1).add(sin(time.mul(speedNode)).mul(amountNode))
    const centered = uvIn.sub(0.5).div(scale).add(0.5)
    return vec2(centered.x, centered.y)
  },
  props.order,
  'uv',
)
</script>

<template><!-- --></template>

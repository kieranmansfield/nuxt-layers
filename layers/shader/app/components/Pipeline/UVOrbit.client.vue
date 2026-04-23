<script setup lang="ts">
// @ts-nocheck
import { uniform, time, vec2, cos, sin } from 'three/tsl'

/**
 * Rotates UV around a centre point continuously over time.
 * Distinct from UVRotate (static angle) — this is always animated.
 */
const props = withDefaults(defineProps<{
  /** Orbit speed in radians per second */
  speed?: number
  order?: number
}>(), { speed: 0.5, order: 0 })

const speedNode = uniform(props.speed)
watch(() => props.speed, v => { speedNode.value = v })

useShaderStage(
  (uvIn) => {
    const angle = time.mul(speedNode)
    const c = cos(angle)
    const s = sin(angle)
    const centered = uvIn.sub(0.5)
    return vec2(
      centered.x.mul(c).sub(centered.y.mul(s)),
      centered.x.mul(s).add(centered.y.mul(c)),
    ).add(0.5)
  },
  props.order,
  'uv',
)
</script>

<template><!-- --></template>

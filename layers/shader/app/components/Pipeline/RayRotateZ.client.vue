<script setup lang="ts">
// @ts-nocheck
import { uniform, cos, sin, vec3 } from 'three/tsl'

const props = withDefaults(defineProps<{
  /** Rotation angle in radians */
  angle?: number
  order?: number
}>(), { angle: 0, order: 0 })

const angleNode = uniform(props.angle)
watch(() => props.angle, v => { angleNode.value = v })

useShaderStage(
  (ray) => {
    const c = cos(angleNode)
    const s = sin(angleNode)
    return vec3(ray.x.mul(c).sub(ray.y.mul(s)), ray.x.mul(s).add(ray.y.mul(c)), ray.z)
  },
  props.order,
  'ray',
)
</script>

<template><!-- --></template>

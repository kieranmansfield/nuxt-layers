<script setup lang="ts">
// @ts-nocheck
import { uniform, time, vec2 } from 'three/tsl'
import { fbm2D } from '../../shaders/common/noise'

const props = withDefaults(defineProps<{
  /** Warp strength in UV units */
  strength?: number
  /** Noise input scale */
  scale?: number
  /** Animation speed */
  speed?: number
  order?: number
}>(), { strength: 0.3, scale: 2, speed: 0.2, order: 0 })

const strengthNode = uniform(props.strength)
const scaleNode = uniform(props.scale)
const speedNode = uniform(props.speed)
watch(() => props.strength, v => { strengthNode.value = v })
watch(() => props.scale, v => { scaleNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })

useShaderStage(
  (uvIn) => {
    const t = time.mul(speedNode)
    const warpX = fbm2D(uvIn.mul(scaleNode).add(t))
    const warpY = fbm2D(uvIn.mul(scaleNode).add(vec2(5.2, 1.3)).add(t))
    return uvIn.add(vec2(warpX, warpY).mul(strengthNode))
  },
  props.order,
  'uv',
)
</script>

<template><!-- --></template>

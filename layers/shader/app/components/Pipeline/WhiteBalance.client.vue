<script setup lang="ts">
// @ts-nocheck
import { uniform, vec3, vec4, mix, float } from 'three/tsl'

const props = withDefaults(defineProps<{
  /**
   * Colour temperature shift:
   * positive → warmer (orange), negative → cooler (blue). Range: -1 to 1.
   */
  temperature?: number
  /**
   * Tint shift:
   * positive → green, negative → magenta. Range: -1 to 1.
   */
  tint?: number
  order?: number
}>(), { temperature: 0, tint: 0, order: 0 })

const tempNode = uniform(props.temperature)
const tintNode = uniform(props.tint)
watch(() => props.temperature, v => { tempNode.value = v })
watch(() => props.tint, v => { tintNode.value = v })

useShaderStage(
  (prev) => {
    // Temperature: mix toward warm (orange) or cool (blue)
    const warm = vec3(float(1).add(tempNode.mul(0.15)), float(1), float(1).sub(tempNode.mul(0.25)))
    // Tint: mix toward green or magenta on the G channel
    const tinted = vec3(
      float(1).sub(tintNode.negate().max(float(0)).mul(0.1)),
      float(1).add(tintNode.mul(0.1)),
      float(1).sub(tintNode.max(float(0)).mul(0.1)),
    )
    return vec4(prev.xyz.mul(warm).mul(tinted), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>

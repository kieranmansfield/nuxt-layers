<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, vec4, mix, smoothstep, float } from 'three/tsl'
import { luminance } from '../../shaders/common/blend'

/**
 * Red/warm glow bleed around highlight areas — the analogue film halation effect.
 * Bright areas bleed a coloured halo into their surroundings.
 */
const props = withDefaults(defineProps<{
  /** Glow colour */
  color?: string
  /** Luminance threshold above which glow starts */
  threshold?: number
  /** Glow intensity */
  intensity?: number
  order?: number
}>(), { color: '#ff2200', threshold: 0.7, intensity: 0.4, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorNode = toVec3Node(props.color)
const thresholdNode = uniform(props.threshold)
const intensityNode = uniform(props.intensity)
watch(() => props.color, v => { const c = new Color(v); colorNode.value.set(c.r, c.g, c.b) })
watch(() => props.threshold, v => { thresholdNode.value = v })
watch(() => props.intensity, v => { intensityNode.value = v })

useShaderStage(
  (prev) => {
    const lum = luminance(prev.xyz)
    const glow = smoothstep(thresholdNode, float(1), lum).mul(intensityNode)
    return vec4(prev.xyz.add(colorNode.mul(glow)), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>

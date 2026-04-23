<script setup lang="ts">
// @ts-nocheck
import { smoothstep, uniform, vec4 } from 'three/tsl'

/**
 * Fades the accumulated pipeline colour toward transparent/black based on
 * a UV axis threshold. Useful as a final Y/X-axis gradient mask.
 *
 * Example (Grainient final step):
 *   <MixBlend axis="y" :edge0="0.45" :edge1="0.55" />
 */
const props = withDefaults(defineProps<{
  axis?: 'x' | 'y'
  edge0?: number
  edge1?: number
  /** 0 = fade to transparent, 1 = fade to opaque (keep prev) */
  invert?: boolean
  order?: number
}>(), {
  axis: 'y',
  edge0: 0.45,
  edge1: 0.55,
  invert: false,
  order: 0,
})

const edge0Node = uniform(props.edge0)
const edge1Node = uniform(props.edge1)
watch(() => props.edge0, v => { edge0Node.value = v })
watch(() => props.edge1, v => { edge1Node.value = v })

const { uvNode } = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const coord = props.axis === 'x' ? uvNode.value.x : uvNode.value.y
    const mask = smoothstep(edge0Node, edge1Node, coord)
    const alpha = props.invert ? mask.oneMinus() : mask
    return vec4(prev.xyz, prev.w.mul(alpha))
  },
  props.order,
)
</script>

<template><!-- --></template>

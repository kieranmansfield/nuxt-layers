<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, vec4, mix } from 'three/tsl'
import { luminance } from '../../shaders/common/blend'

const props = withDefaults(defineProps<{
  /** Shadow colour (low luminance) */
  shadowColor?: string
  /** Highlight colour (high luminance) */
  highlightColor?: string
  order?: number
}>(), { shadowColor: '#1a0033', highlightColor: '#ffcc00', order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const shadowNode = toVec3Node(props.shadowColor)
const highlightNode = toVec3Node(props.highlightColor)
watch(() => props.shadowColor, v => { const c = new Color(v); shadowNode.value.set(c.r, c.g, c.b) })
watch(() => props.highlightColor, v => { const c = new Color(v); highlightNode.value.set(c.r, c.g, c.b) })

useShaderStage(
  (prev) => {
    const lum = luminance(prev.xyz)
    return vec4(mix(shadowNode, highlightNode, lum), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>

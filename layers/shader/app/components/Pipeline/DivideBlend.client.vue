<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, vec4, mix, clamp, float } from 'three/tsl'

const props = withDefaults(defineProps<{
  color?: string
  opacity?: number
  order?: number
}>(), { color: '#808080', opacity: 1, order: 0 })

const colorNode = (() => { const c = new Color(props.color); return uniform(new Vector3(c.r, c.g, c.b)) })()
const opacityNode = uniform(props.opacity)
watch(() => props.color, v => { const c = new Color(v); colorNode.value.set(c.r, c.g, c.b) })
watch(() => props.opacity, v => { opacityNode.value = v })

useShaderStage(
  (prev) => {
    const divided = clamp(prev.xyz.div(colorNode.max(float(0.001))), float(0), float(1))
    return vec4(mix(prev.xyz, divided, opacityNode), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>

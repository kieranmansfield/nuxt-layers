<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, vec4, mix } from 'three/tsl'
import { blendExclusion } from '../../shaders/common/blend'

const props = withDefaults(defineProps<{
  color?: string
  opacity?: number
  order?: number
}>(), { color: '#ffffff', opacity: 1, order: 0 })

const colorNode = (() => { const c = new Color(props.color); return uniform(new Vector3(c.r, c.g, c.b)) })()
const opacityNode = uniform(props.opacity)
watch(() => props.color, v => { const c = new Color(v); colorNode.value.set(c.r, c.g, c.b) })
watch(() => props.opacity, v => { opacityNode.value = v })

useShaderStage(
  (prev) => vec4(mix(prev.xyz, blendExclusion(prev.xyz, colorNode), opacityNode), prev.w),
  props.order,
)
</script>

<template><!-- --></template>

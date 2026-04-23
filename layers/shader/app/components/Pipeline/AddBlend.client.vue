<script setup lang="ts">
// @ts-nocheck
import { Color } from 'three'
import { clamp, uniform, vec4 } from 'three/tsl'
import { blendAdd } from '../../shaders/common/blend'

const props = withDefaults(defineProps<{
  color?: string
  opacity?: number
  order?: number
}>(), { color: '#808080', opacity: 1, order: 0 })

const colorNode = uniform(new Color(props.color))
const opacityNode = uniform(props.opacity)
watch(() => props.color, v => { colorNode.value.set(v) })
watch(() => props.opacity, v => { opacityNode.value = v })

useShaderStage(
  (prev) => clamp(vec4(blendAdd(prev.xyz, colorNode, opacityNode), prev.w), 0, 1),
  props.order,
)
</script>

<template><!-- --></template>

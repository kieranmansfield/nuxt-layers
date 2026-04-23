<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, vec4 } from 'three/tsl'
import { desaturate } from '../../shaders/common/blend'

const props = withDefaults(defineProps<{
  /** Tint colour applied after desaturation */
  color?: string
  /** How much to desaturate before tinting: 1 = full greyscale */
  desaturation?: number
  order?: number
}>(), { color: '#4466aa', desaturation: 1, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorNode = toVec3Node(props.color)
const desatNode = uniform(props.desaturation)
watch(() => props.color, v => { const c = new Color(v); colorNode.value.set(c.r, c.g, c.b) })
watch(() => props.desaturation, v => { desatNode.value = v })

useShaderStage(
  (prev) => vec4(desaturate(prev.xyz, desatNode).mul(colorNode), prev.w),
  props.order,
)
</script>

<template><!-- --></template>

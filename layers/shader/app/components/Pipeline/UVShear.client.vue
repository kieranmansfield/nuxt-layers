<script setup lang="ts">
// @ts-nocheck
import { uniform, vec2 } from 'three/tsl'

const props = withDefaults(defineProps<{
  /** Horizontal shear: shifts X by Y * shearX */
  shearX?: number
  /** Vertical shear: shifts Y by X * shearY */
  shearY?: number
  order?: number
}>(), { shearX: 0.2, shearY: 0, order: 0 })

const shearXNode = uniform(props.shearX)
const shearYNode = uniform(props.shearY)
watch(() => props.shearX, v => { shearXNode.value = v })
watch(() => props.shearY, v => { shearYNode.value = v })

useShaderStage(
  (uvIn) => vec2(uvIn.x.add(uvIn.y.mul(shearXNode)), uvIn.y.add(uvIn.x.mul(shearYNode))),
  props.order,
  'uv',
)
</script>

<template><!-- --></template>

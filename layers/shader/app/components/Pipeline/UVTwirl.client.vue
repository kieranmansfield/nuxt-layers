<script setup lang="ts">
// @ts-nocheck
import { uniform } from 'three/tsl'
import { swirlUV } from '../../shaders/common/uv'

const props = withDefaults(defineProps<{
  /** Swirl strength in radians */
  strength?: number
  /** Effective radius of the swirl */
  radius?: number
  order?: number
}>(), { strength: 3, radius: 0.5, order: 0 })

const strengthNode = uniform(props.strength)
const radiusNode = uniform(props.radius)
watch(() => props.strength, v => { strengthNode.value = v })
watch(() => props.radius, v => { radiusNode.value = v })

useShaderStage(
  (uvIn) => swirlUV(uvIn, [0.5, 0.5], strengthNode, radiusNode),
  props.order,
  'uv',
)
</script>

<template><!-- --></template>

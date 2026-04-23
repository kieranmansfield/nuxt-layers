<script setup lang="ts">
// @ts-nocheck
import { uniform } from 'three/tsl'
import { bulgeUV } from '../../shaders/common/uv'

const props = withDefaults(defineProps<{
  /** Positive = bulge outward, negative = pinch inward */
  strength?: number
  /** Effective radius of the distortion */
  radius?: number
  order?: number
}>(), { strength: 0.5, radius: 0.5, order: 0 })

const strengthNode = uniform(props.strength)
const radiusNode = uniform(props.radius)
watch(() => props.strength, v => { strengthNode.value = v })
watch(() => props.radius, v => { radiusNode.value = v })

useShaderStage(
  (uvIn) => bulgeUV(uvIn, { strength: strengthNode, radius: radiusNode }),
  props.order,
  'uv',
)
</script>

<template><!-- --></template>

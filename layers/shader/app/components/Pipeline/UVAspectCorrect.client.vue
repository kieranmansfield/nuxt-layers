<script setup lang="ts">
// @ts-nocheck
import { screenSize, vec2 } from 'three/tsl'

const { order = 0 } = defineProps<{ order?: number }>()

useShaderStage(
  (uvIn) => uvIn.mul(vec2(screenSize.x.div(screenSize.y), 1.0)),
  order,
  'uv',
)
</script>

<template><!-- --></template>

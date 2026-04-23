<script setup lang="ts">
// @ts-nocheck
import { vec4 } from 'three/tsl'
import { invert } from '../../shaders/common/blend'

const { order = 0 } = defineProps<{ order?: number }>()

useShaderStage(
  (prev) => vec4(invert(prev.xyz), prev.w),
  order,
)
</script>

<template><!-- --></template>

<script setup lang="ts">
// @ts-nocheck
import { vec4 } from 'three/tsl'
import { acesTonemap } from '../../shaders/common/tonemapping'

const { order = 0 } = defineProps<{ order?: number }>()

useShaderStage(
  (prev) => vec4(acesTonemap(prev.xyz), prev.w),
  order,
)
</script>

<template><!-- --></template>

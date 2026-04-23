<script setup lang="ts">
// @ts-nocheck
import { uniform } from 'three/tsl'

const props = withDefaults(defineProps<{
  /** Number of pixel columns/rows — lower = chunkier pixels */
  gridSize?: number
  order?: number
}>(), { gridSize: 64, order: 0 })

const gridSizeNode = uniform(props.gridSize)
watch(() => props.gridSize, v => { gridSizeNode.value = v })

useShaderStage(
  (uvIn) => uvIn.mul(gridSizeNode).floor().div(gridSizeNode),
  order,
  'uv',
)
</script>

<template><!-- --></template>

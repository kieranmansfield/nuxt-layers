<script setup lang="ts">
// @ts-nocheck
import { uniform, vec4 } from 'three/tsl'
import { saturate } from '../../shaders/common/blend'

const props = withDefaults(defineProps<{
  /** Saturation boost: 0 = unchanged, positive = more saturated */
  amount?: number
  order?: number
}>(), { amount: 0.5, order: 0 })

const amountNode = uniform(props.amount)
watch(() => props.amount, v => { amountNode.value = v })

useShaderStage(
  (prev) => vec4(saturate(prev.xyz, amountNode), prev.w),
  props.order,
)
</script>

<template><!-- --></template>

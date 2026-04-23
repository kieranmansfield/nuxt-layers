<script setup lang="ts">
// @ts-nocheck
import { uniform, vec4 } from 'three/tsl'
import { vibrance } from '../../shaders/common/palette'

const props = withDefaults(defineProps<{
  /**
   * Saturation boost that protects already-saturated colours.
   * 0 = unchanged, positive = more vivid, negative = less.
   */
  amount?: number
  order?: number
}>(), { amount: 0.5, order: 0 })

const amountNode = uniform(props.amount)
watch(() => props.amount, v => { amountNode.value = v })

useShaderStage(
  (prev) => vec4(vibrance(prev.xyz, amountNode), prev.w),
  props.order,
)
</script>

<template><!-- --></template>

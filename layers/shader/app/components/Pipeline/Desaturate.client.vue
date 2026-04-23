<script setup lang="ts">
// @ts-nocheck
import { uniform, vec4 } from 'three/tsl'
import { desaturate } from '../../shaders/common/blend'

const props = withDefaults(defineProps<{
  /** 0 = original colour, 1 = full greyscale */
  amount?: number
  order?: number
}>(), { amount: 1, order: 0 })

const amountNode = uniform(props.amount)
watch(() => props.amount, v => { amountNode.value = v })

useShaderStage(
  (prev) => vec4(desaturate(prev.xyz, amountNode), prev.w),
  props.order,
)
</script>

<template><!-- --></template>

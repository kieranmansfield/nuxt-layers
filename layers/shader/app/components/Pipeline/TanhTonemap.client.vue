<script setup lang="ts">
// @ts-nocheck
import { uniform, vec4 } from 'three/tsl'
import { tanhTonemap } from '../../shaders/common/tonemapping'

const props = withDefaults(defineProps<{
  /** Controls how aggressively values above 1 are compressed. dawn5 uses 2.5. */
  exposure?: number
  order?: number
}>(), {
  exposure: 1.0,
  order: 0,
})

const exposureNode = uniform(props.exposure)
watch(() => props.exposure, v => { exposureNode.value = v })

useShaderStage(
  (prev) => vec4(tanhTonemap(prev.xyz.mul(exposureNode)), prev.w),
  props.order,
)
</script>

<template><!-- --></template>

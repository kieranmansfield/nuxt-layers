<script setup lang="ts">
// @ts-nocheck
import { Color } from 'three'
import { uniform, vec4 } from 'three/tsl'

const props = withDefaults(defineProps<{
  color?: string
  order?: number
}>(), {
  color: '#ffffff',
  order: 0,
})

const colorVal = new Color(props.color)
const colorNode = uniform(colorVal)
watch(() => props.color, v => { colorNode.value.set(v) })

useShaderStage((_prev) => vec4(colorNode, 1.0), props.order)
</script>

<template><!-- --></template>

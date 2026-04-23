<script setup lang="ts">
// @ts-nocheck
import { Color } from 'three'
import { mix, uniform, vec4 } from 'three/tsl'

const props = withDefaults(defineProps<{
  colorA?: string
  colorB?: string
  axis?: 'x' | 'y'
  order?: number
}>(), {
  colorA: '#000000',
  colorB: '#ffffff',
  axis: 'y',
  order: 0,
})

const colorAVal = new Color(props.colorA)
const colorBVal = new Color(props.colorB)
const colorANode = uniform(colorAVal)
const colorBNode = uniform(colorBVal)
watch(() => props.colorA, v => { colorANode.value.set(v) })
watch(() => props.colorB, v => { colorBNode.value.set(v) })

const { uvNode } = useShaderPipelineContext()

useShaderStage(
  (_prev) => {
    const t = props.axis === 'x' ? uvNode.value.x : uvNode.value.y
    return vec4(mix(colorANode, colorBNode, t), 1.0)
  },
  props.order,
)
</script>

<template><!-- --></template>

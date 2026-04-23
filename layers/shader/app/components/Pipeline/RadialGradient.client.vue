<script setup lang="ts">
// @ts-nocheck
import { Color } from 'three'
import { clamp, mix, uniform, vec4 } from 'three/tsl'

const props = withDefaults(defineProps<{
  colorCenter?: string
  colorEdge?: string
  radius?: number
  order?: number
}>(), {
  colorCenter: '#ffffff',
  colorEdge: '#000000',
  radius: 0.7,
  order: 0,
})

const colorCenterVal = new Color(props.colorCenter)
const colorEdgeVal = new Color(props.colorEdge)
const colorCenterNode = uniform(colorCenterVal)
const colorEdgeNode = uniform(colorEdgeVal)
const radiusNode = uniform(props.radius)

watch(() => props.colorCenter, v => { colorCenterNode.value.set(v) })
watch(() => props.colorEdge, v => { colorEdgeNode.value.set(v) })
watch(() => props.radius, v => { radiusNode.value = v })

const { uvNode } = useShaderPipelineContext()

useShaderStage(
  (_prev) => {
    const t = clamp(uvNode.value.sub(0.5).length().div(radiusNode), 0, 1)
    return vec4(mix(colorCenterNode, colorEdgeNode, t), 1.0)
  },
  props.order,
)
</script>

<template><!-- --></template>

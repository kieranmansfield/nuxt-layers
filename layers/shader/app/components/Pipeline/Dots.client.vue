<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, vec4, mix, float } from 'three/tsl'
import { dots } from '../../shaders/common/shapes'

const props = withDefaults(defineProps<{
  colorA?: string
  colorB?: string
  cellSize?: number
  dotRadius?: number
  softness?: number
  order?: number
}>(), { colorA: '#000000', colorB: '#ffffff', cellSize: 0.08, dotRadius: 0.025, softness: 0.005, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorANode = toVec3Node(props.colorA)
const colorBNode = toVec3Node(props.colorB)
const cellNode = uniform(props.cellSize)
const dotNode = uniform(props.dotRadius)
const softNode = uniform(props.softness)
watch(() => props.colorA, v => { const c = new Color(v); colorANode.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); colorBNode.value.set(c.r, c.g, c.b) })
watch(() => props.cellSize, v => { cellNode.value = v })
watch(() => props.dotRadius, v => { dotNode.value = v })
watch(() => props.softness, v => { softNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uv = pipeline.uvNode.value
    const mask = dots(uv, cellNode, dotNode, softNode)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>

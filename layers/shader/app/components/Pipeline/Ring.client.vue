<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, vec4, mix, float } from 'three/tsl'
import { ring } from '../../shaders/common/shapes'

const props = withDefaults(defineProps<{
  colorA?: string
  colorB?: string
  innerRadius?: number
  outerRadius?: number
  softness?: number
  order?: number
}>(), { colorA: '#000000', colorB: '#ffffff', innerRadius: 0.25, outerRadius: 0.4, softness: 0.01, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorANode = toVec3Node(props.colorA)
const colorBNode = toVec3Node(props.colorB)
const innerNode = uniform(props.innerRadius)
const outerNode = uniform(props.outerRadius)
const softnessNode = uniform(props.softness)
watch(() => props.colorA, v => { const c = new Color(v); colorANode.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); colorBNode.value.set(c.r, c.g, c.b) })
watch(() => props.innerRadius, v => { innerNode.value = v })
watch(() => props.outerRadius, v => { outerNode.value = v })
watch(() => props.softness, v => { softnessNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uv = pipeline.uvNode.value
    const mask = ring(uv, [0.5, 0.5], innerNode, outerNode, softnessNode)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>

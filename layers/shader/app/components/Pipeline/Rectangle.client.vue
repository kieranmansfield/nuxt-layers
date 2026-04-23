<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, vec4, mix, float } from 'three/tsl'
import { roundedRect } from '../../shaders/common/shapes'

const props = withDefaults(defineProps<{
  colorA?: string
  colorB?: string
  width?: number
  height?: number
  cornerRadius?: number
  softness?: number
  order?: number
}>(), { colorA: '#000000', colorB: '#ffffff', width: 0.6, height: 0.4, cornerRadius: 0.05, softness: 0.01, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorANode = toVec3Node(props.colorA)
const colorBNode = toVec3Node(props.colorB)
const widthNode = uniform(props.width)
const heightNode = uniform(props.height)
const cornerNode = uniform(props.cornerRadius)
const softnessNode = uniform(props.softness)
watch(() => props.colorA, v => { const c = new Color(v); colorANode.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); colorBNode.value.set(c.r, c.g, c.b) })
watch(() => props.width, v => { widthNode.value = v })
watch(() => props.height, v => { heightNode.value = v })
watch(() => props.cornerRadius, v => { cornerNode.value = v })
watch(() => props.softness, v => { softnessNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uv = pipeline.uvNode.value
    const mask = roundedRect(uv, [0.5, 0.5], widthNode, cornerNode, softnessNode)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>

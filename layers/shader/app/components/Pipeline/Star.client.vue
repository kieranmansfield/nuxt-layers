<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, vec4, mix, float } from 'three/tsl'
import { star } from '../../shaders/common/shapes'

const props = withDefaults(defineProps<{
  colorA?: string
  colorB?: string
  radius?: number
  /** Number of points */
  points?: number
  /** Inner radius ratio (0–1) */
  innerRatio?: number
  softness?: number
  order?: number
}>(), { colorA: '#000000', colorB: '#ffcc00', radius: 0.35, points: 5, innerRatio: 0.45, softness: 0.01, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorANode = toVec3Node(props.colorA)
const colorBNode = toVec3Node(props.colorB)
const radiusNode = uniform(props.radius)
const innerNode = uniform(props.innerRatio)
const softnessNode = uniform(props.softness)
watch(() => props.colorA, v => { const c = new Color(v); colorANode.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); colorBNode.value.set(c.r, c.g, c.b) })
watch(() => props.radius, v => { radiusNode.value = v })
watch(() => props.innerRatio, v => { innerNode.value = v })
watch(() => props.softness, v => { softnessNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uv = pipeline.uvNode.value
    const mask = star(uv, [0.5, 0.5], radiusNode, props.points, innerNode, softnessNode)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>

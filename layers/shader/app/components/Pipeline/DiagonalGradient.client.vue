<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, vec4, mix, cos, sin, float } from 'three/tsl'

const props = withDefaults(defineProps<{
  colorA?: string
  colorB?: string
  /** Gradient angle in degrees (0 = left→right, 90 = bottom→top) */
  angle?: number
  order?: number
}>(), { colorA: '#000000', colorB: '#ffffff', angle: 45, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorANode = toVec3Node(props.colorA)
const colorBNode = toVec3Node(props.colorB)
const angleNode = uniform(props.angle * Math.PI / 180)
watch(() => props.colorA, v => { const c = new Color(v); colorANode.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); colorBNode.value.set(c.r, c.g, c.b) })
watch(() => props.angle, v => { angleNode.value = v * Math.PI / 180 })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uv = pipeline.uvNode.value
    const t = uv.x.mul(cos(angleNode)).add(uv.y.mul(sin(angleNode))).clamp(float(0), float(1))
    return vec4(mix(colorANode, colorBNode, t), float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>

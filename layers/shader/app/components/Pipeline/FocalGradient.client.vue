<script setup lang="ts">
// @ts-nocheck
import { Color, Vector2, Vector3 } from 'three'
import { uniform, vec2, vec4, mix, float } from 'three/tsl'

/** Radial gradient with an offset focal point — asymmetric radial. */
const props = withDefaults(defineProps<{
  colorA?: string
  colorB?: string
  /** Focal point in UV space [0,1] */
  focal?: [number, number]
  /** Radius of full falloff */
  radius?: number
  order?: number
}>(), { colorA: '#ffffff', colorB: '#000000', focal: () => [0.3, 0.3], radius: 1.2, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorANode = toVec3Node(props.colorA)
const colorBNode = toVec3Node(props.colorB)
const focalNode = uniform(new Vector2(...props.focal))
const radiusNode = uniform(props.radius)
watch(() => props.colorA, v => { const c = new Color(v); colorANode.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); colorBNode.value.set(c.r, c.g, c.b) })
watch(() => props.focal, ([x, y]) => { focalNode.value.set(x, y) })
watch(() => props.radius, v => { radiusNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uv = pipeline.uvNode.value
    const t = uv.sub(vec2(focalNode.x, focalNode.y)).length().div(radiusNode).min(float(1))
    return vec4(mix(colorANode, colorBNode, t), float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>

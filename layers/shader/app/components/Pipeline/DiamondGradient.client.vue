<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, vec4, mix, float } from 'three/tsl'

/** Chebyshev-distance diamond gradient: max(|x|, |y|) from centre. */
const props = withDefaults(defineProps<{
  colorA?: string
  colorB?: string
  /** Scale — higher = faster falloff */
  scale?: number
  order?: number
}>(), { colorA: '#000000', colorB: '#ffffff', scale: 1, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorANode = toVec3Node(props.colorA)
const colorBNode = toVec3Node(props.colorB)
const scaleNode = uniform(props.scale)
watch(() => props.colorA, v => { const c = new Color(v); colorANode.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); colorBNode.value.set(c.r, c.g, c.b) })
watch(() => props.scale, v => { scaleNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uv = pipeline.uvNode.value
    const centered = uv.sub(0.5).abs()
    const t = centered.x.max(centered.y).mul(scaleNode).mul(2).min(float(1))
    return vec4(mix(colorANode, colorBNode, t), float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>

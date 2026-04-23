<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, vec4, mix, smoothstep, float } from 'three/tsl'
import { luminance } from '../../shaders/common/blend'

/**
 * Maps input luminance to a three-stop colour ramp: shadow → midtone → highlight.
 * For a simple two-stop ramp use DuoTone instead.
 */
const props = withDefaults(defineProps<{
  shadowColor?: string
  midtoneColor?: string
  highlightColor?: string
  /** Luminance threshold between shadow and midtone */
  shadowPoint?: number
  /** Luminance threshold between midtone and highlight */
  highlightPoint?: number
  order?: number
}>(), {
  shadowColor: '#000033',
  midtoneColor: '#660066',
  highlightColor: '#ffcc88',
  shadowPoint: 0.33,
  highlightPoint: 0.67,
  order: 0,
})

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const shadowNode = toVec3Node(props.shadowColor)
const midNode = toVec3Node(props.midtoneColor)
const highlightNode = toVec3Node(props.highlightColor)
const shadowPtNode = uniform(props.shadowPoint)
const highlightPtNode = uniform(props.highlightPoint)
watch(() => props.shadowColor, v => { const c = new Color(v); shadowNode.value.set(c.r, c.g, c.b) })
watch(() => props.midtoneColor, v => { const c = new Color(v); midNode.value.set(c.r, c.g, c.b) })
watch(() => props.highlightColor, v => { const c = new Color(v); highlightNode.value.set(c.r, c.g, c.b) })
watch(() => props.shadowPoint, v => { shadowPtNode.value = v })
watch(() => props.highlightPoint, v => { highlightPtNode.value = v })

useShaderStage(
  (prev) => {
    const lum = luminance(prev.xyz)
    const t1 = smoothstep(float(0), shadowPtNode, lum)
    const t2 = smoothstep(shadowPtNode, highlightPtNode, lum)
    const colour = mix(mix(shadowNode, midNode, t1), mix(midNode, highlightNode, t2), t2)
    return vec4(colour, prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>

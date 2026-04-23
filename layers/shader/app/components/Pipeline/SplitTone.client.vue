<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, vec4, mix, smoothstep, float } from 'three/tsl'
import { luminance } from '../../shaders/common/blend'

const props = withDefaults(defineProps<{
  /** Colour pushed into shadow tones */
  shadowColor?: string
  /** Colour pushed into highlight tones */
  highlightColor?: string
  /** Balance point: 0.5 = even split, lower = shadows dominate */
  balance?: number
  /** Overall blend strength */
  opacity?: number
  order?: number
}>(), { shadowColor: '#1a2a5a', highlightColor: '#ffeecc', balance: 0.5, opacity: 0.5, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const shadowNode = toVec3Node(props.shadowColor)
const highlightNode = toVec3Node(props.highlightColor)
const balanceNode = uniform(props.balance)
const opacityNode = uniform(props.opacity)
watch(() => props.shadowColor, v => { const c = new Color(v); shadowNode.value.set(c.r, c.g, c.b) })
watch(() => props.highlightColor, v => { const c = new Color(v); highlightNode.value.set(c.r, c.g, c.b) })
watch(() => props.balance, v => { balanceNode.value = v })
watch(() => props.opacity, v => { opacityNode.value = v })

useShaderStage(
  (prev) => {
    const lum = luminance(prev.xyz)
    const shadowMask = smoothstep(balanceNode, float(0), lum)
    const highlightMask = smoothstep(balanceNode, float(1), lum)
    const toned = prev.xyz
      .add(shadowNode.mul(shadowMask).mul(opacityNode))
      .add(highlightNode.mul(highlightMask).mul(opacityNode))
    return vec4(toned, prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>

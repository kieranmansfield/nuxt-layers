<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { float, mix, step, uniform, vec4 } from 'three/tsl'

const props = withDefaults(defineProps<{
  colorA?: string
  colorB?: string
  /** Optional third stop (defaults to colorB when omitted → 2-stop gradient) */
  colorC?: string
  /** Optional fourth stop (defaults to colorC when omitted → 3-stop gradient) */
  colorD?: string
  axis?: 'x' | 'y'
  order?: number
}>(), {
  colorA: '#000000',
  colorB: '#ffffff',
  colorC: undefined,
  colorD: undefined,
  axis: 'y',
  order: 0,
})

function toVec3U(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const cA = toVec3U(props.colorA)
const cB = toVec3U(props.colorB)
const cC = toVec3U(props.colorC ?? props.colorB)
const cD = toVec3U(props.colorD ?? props.colorC ?? props.colorB)

watch(() => props.colorA, v => { const c = new Color(v); cA.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); cB.value.set(c.r, c.g, c.b) })
watch(() => props.colorC, v => { const c = new Color(v ?? props.colorB); cC.value.set(c.r, c.g, c.b) })
watch(() => props.colorD, v => { const c = new Color(v ?? props.colorC ?? props.colorB); cD.value.set(c.r, c.g, c.b) })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const t = props.axis === 'x' ? pipeline.uvNode.value.x : pipeline.uvNode.value.y

    // Map t [0,1] to 3 equal segments, clamping so t=1 maps to lt=1 not lt=0
    const tN = t.mul(float(3)).min(float(2.9999))
    const seg = tN.floor()
    const lt = tN.sub(seg)    // local t within segment [0,1)

    // All three segment interpolations share the same local t
    const c01 = mix(cA, cB, lt)
    const c12 = mix(cB, cC, lt)
    const c23 = mix(cC, cD, lt)

    // step(edge, x): 0 if x < edge, 1 if x >= edge
    const inSeg1 = step(float(1), tN)   // 1 when in segments 1 or 2
    const inSeg2 = step(float(2), tN)   // 1 when in segment 2

    // Cascade: start with c01, replace with c12 at seg>=1, replace with c23 at seg>=2
    const col = mix(mix(c01, c12, inSeg1), c23, inSeg2)
    return vec4(col, float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>

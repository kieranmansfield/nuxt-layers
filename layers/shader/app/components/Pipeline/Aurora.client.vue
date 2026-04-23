<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, time, vec2, vec3, vec4, mix, sin, float, clamp } from 'three/tsl'
import { fbm2D } from '../../shaders/common/noise'

/**
 * Aurora borealis — layered animated colour bands across the upper screen.
 * Uses FBM noise to create organic ribbon-like curtains of light.
 */
const props = withDefaults(defineProps<{
  /** Primary aurora colour */
  colorA?: string
  /** Secondary aurora colour */
  colorB?: string
  /** Vertical position of aurora band centre */
  bandY?: number
  /** Vertical band height */
  bandHeight?: number
  /** Animation speed */
  speed?: number
  /** Effect intensity */
  intensity?: number
  order?: number
}>(), {
  colorA: '#00ff88',
  colorB: '#8844ff',
  bandY: 0.7,
  bandHeight: 0.3,
  speed: 0.3,
  intensity: 0.7,
  order: 0,
})

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorANode = toVec3Node(props.colorA)
const colorBNode = toVec3Node(props.colorB)
const bandYNode = uniform(props.bandY)
const bandHNode = uniform(props.bandHeight)
const speedNode = uniform(props.speed)
const intensityNode = uniform(props.intensity)
watch(() => props.colorA, v => { const c = new Color(v); colorANode.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); colorBNode.value.set(c.r, c.g, c.b) })
watch(() => props.bandY, v => { bandYNode.value = v })
watch(() => props.bandHeight, v => { bandHNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })
watch(() => props.intensity, v => { intensityNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  (prev) => {
    const uv = pipeline.uvNode.value
    const t = time.mul(speedNode)

    // FBM-warped vertical position to create curtain ripple
    const warpedX = uv.x.add(fbm2D(uv.mul(2).add(t)).mul(0.15))
    // warpedX is a float (scalar) — must wrap in vec2 before passing to fbm2D
    const n = fbm2D(vec2(warpedX, uv.y).mul(3).add(t.mul(0.5)))

    // Vertical band mask — soft gaussian around bandY
    const dy = uv.y.sub(bandYNode.add(n.mul(0.1)))
    const bandMask = clamp(float(1).sub(dy.abs().div(bandHNode)), 0, 1)
    bandMask.pow(2)

    // Colour: mix A/B via second noise layer
    const colourMix = fbm2D(uv.mul(1.5).add(t.mul(0.3).add(1.5))).mul(0.5).add(0.5)
    const aurora = mix(colorANode, colorBNode, colourMix)

    const contribution = aurora.mul(bandMask.pow(2)).mul(intensityNode)
    return vec4(prev.xyz.add(contribution), prev.w)
  },
  props.order,
)
</script>

<template><!-- --></template>

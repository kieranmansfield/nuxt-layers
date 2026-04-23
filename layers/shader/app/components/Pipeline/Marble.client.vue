<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, time, vec4, mix, sin, float } from 'three/tsl'
import { fbm2D } from '../../shaders/common/noise'

const props = withDefaults(defineProps<{
  /** Base (vein background) colour */
  colorA?: string
  /** Vein colour */
  colorB?: string
  /** Marble vein frequency */
  frequency?: number
  /** FBM noise scale for vein turbulence */
  noiseScale?: number
  /** Noise strength applied to sine input */
  noiseStrength?: number
  /** Vein sharpness — higher = thinner veins */
  sharpness?: number
  /** Animation speed */
  speed?: number
  order?: number
}>(), {
  colorA: '#f5f0e8',
  colorB: '#6a5a4a',
  frequency: 5,
  noiseScale: 3,
  noiseStrength: 8,
  sharpness: 4,
  speed: 0,
  order: 0,
})

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorANode = toVec3Node(props.colorA)
const colorBNode = toVec3Node(props.colorB)
const freqNode = uniform(props.frequency)
const noiseScaleNode = uniform(props.noiseScale)
const noiseStrNode = uniform(props.noiseStrength)
const sharpNode = uniform(props.sharpness)
const speedNode = uniform(props.speed)
watch(() => props.colorA, v => { const c = new Color(v); colorANode.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); colorBNode.value.set(c.r, c.g, c.b) })
watch(() => props.frequency, v => { freqNode.value = v })
watch(() => props.noiseScale, v => { noiseScaleNode.value = v })
watch(() => props.noiseStrength, v => { noiseStrNode.value = v })
watch(() => props.sharpness, v => { sharpNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uv = pipeline.uvNode.value
    const t = time.mul(speedNode)
    const n = fbm2D(uv.mul(noiseScaleNode).add(t))
    // Sine + noise offset creates the vein pattern
    const vein = sin(uv.x.mul(freqNode).add(n.mul(noiseStrNode))).abs().pow(sharpNode)
    return vec4(mix(colorANode, colorBNode, vein), float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>

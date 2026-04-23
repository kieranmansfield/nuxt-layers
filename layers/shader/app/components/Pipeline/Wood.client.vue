<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, time, vec4, mix, sin, float } from 'three/tsl'
import { fbm2D } from '../../shaders/common/noise'

const props = withDefaults(defineProps<{
  colorA?: string
  colorB?: string
  /** Number of rings across the UV space */
  ringFrequency?: number
  /** Noise distortion scale */
  noiseScale?: number
  /** Noise displacement strength */
  noiseStrength?: number
  /** Very slow rotation speed for living wood effect */
  speed?: number
  order?: number
}>(), {
  colorA: '#8b5e3c',
  colorB: '#4a2e1a',
  ringFrequency: 12,
  noiseScale: 3,
  noiseStrength: 0.4,
  speed: 0,
  order: 0,
})

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorANode = toVec3Node(props.colorA)
const colorBNode = toVec3Node(props.colorB)
const ringFreqNode = uniform(props.ringFrequency)
const noiseScaleNode = uniform(props.noiseScale)
const noiseStrNode = uniform(props.noiseStrength)
const speedNode = uniform(props.speed)
watch(() => props.colorA, v => { const c = new Color(v); colorANode.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); colorBNode.value.set(c.r, c.g, c.b) })
watch(() => props.ringFrequency, v => { ringFreqNode.value = v })
watch(() => props.noiseScale, v => { noiseScaleNode.value = v })
watch(() => props.noiseStrength, v => { noiseStrNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uv = pipeline.uvNode.value
    const t = time.mul(speedNode)
    const n = fbm2D(uv.mul(noiseScaleNode).add(t)).mul(noiseStrNode)
    // Concentric rings from centre with noise offset
    const dist = uv.sub(0.5).length().add(n)
    const ring = sin(dist.mul(ringFreqNode).mul(Math.PI * 2)).mul(0.5).add(0.5)
    return vec4(mix(colorANode, colorBNode, ring), float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>

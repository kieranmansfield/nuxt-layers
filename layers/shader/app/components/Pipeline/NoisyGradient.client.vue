<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, time, vec4, mix, float } from 'three/tsl'
import { fbm2D } from '../../shaders/common/noise'

/** Linear gradient with per-pixel FBM noise offset — living, organic gradient. */
const props = withDefaults(defineProps<{
  colorA?: string
  colorB?: string
  /** Gradient axis angle in degrees */
  angle?: number
  /** Noise displacement strength */
  noiseStrength?: number
  /** Noise input scale */
  noiseScale?: number
  /** Animation speed */
  speed?: number
  order?: number
}>(), { colorA: '#1a0a5a', colorB: '#ff8866', angle: 0, noiseStrength: 0.3, noiseScale: 2, speed: 0.15, order: 0 })

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorANode = toVec3Node(props.colorA)
const colorBNode = toVec3Node(props.colorB)
const angleNode = uniform(props.angle * Math.PI / 180)
const noiseStrNode = uniform(props.noiseStrength)
const noiseScaleNode = uniform(props.noiseScale)
const speedNode = uniform(props.speed)
watch(() => props.colorA, v => { const c = new Color(v); colorANode.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); colorBNode.value.set(c.r, c.g, c.b) })
watch(() => props.angle, v => { angleNode.value = v * Math.PI / 180 })
watch(() => props.noiseStrength, v => { noiseStrNode.value = v })
watch(() => props.noiseScale, v => { noiseScaleNode.value = v })
watch(() => props.speed, v => { speedNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uv = pipeline.uvNode.value
    const n = fbm2D(uv.mul(noiseScaleNode).add(time.mul(speedNode)))
    const base = uv.x.mul(angleNode.cos()).add(uv.y.mul(angleNode.sin()))
    const t = base.add(n.mul(noiseStrNode)).clamp(float(0), float(1))
    return vec4(mix(colorANode, colorBNode, t), float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>

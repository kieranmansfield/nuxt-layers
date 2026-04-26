<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform, time, vec2, vec4, mix, smoothstep, cos, sin, float } from 'three/tsl'
import { simplexNoise2D } from '../../shaders/common/noise'

/**
 * Self-contained Grainient/Shadertoy gradient pattern.
 * Combines: GradientNoise → noise-driven UV rotation → asymmetric sine warp
 *           → rotated two-colour blend.
 * Equivalent to: UVNoiseRotate + UVSineWarpXY + RotatedGradientBlend in one component.
 * Exposes all params individually so the pipeline can still intercept at any stage,
 * but provides a convenient self-contained starting point.
 */
const props = withDefaults(defineProps<{
  colorA?: string
  colorB?: string
  /** Noise input scale */
  noiseScale?: number
  /** Max rotation amount driven by noise (degrees) */
  rotationAmount?: number
  /** Sine warp frequency */
  warpFrequency?: number
  /** Sine warp amplitude (higher = subtler) */
  warpAmplitude?: number
  /** Gradient blend angle (degrees) */
  blendAngle?: number
  /** Smoothstep lower edge */
  edge0?: number
  /** Smoothstep upper edge */
  edge1?: number
  /** Animation speed */
  speed?: number
  order?: number
}>(), {
  colorA: '#1a0a5a',
  colorB: '#ff6688',
  noiseScale: 1,
  rotationAmount: 720,
  warpFrequency: 3,
  warpAmplitude: 3,
  blendAngle: 45,
  edge0: 0.2,
  edge1: 0.8,
  speed: 0.3,
  order: 0,
})

const DEG2RAD = Math.PI / 180

function toVec3Node(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorANode = toVec3Node(props.colorA)
const colorBNode = toVec3Node(props.colorB)
const noiseScaleNode = uniform(props.noiseScale)
const rotAmountNode = uniform(props.rotationAmount * DEG2RAD)
const warpFreqNode = uniform(props.warpFrequency)
const warpAmpNode = uniform(props.warpAmplitude)
const blendAngleNode = uniform(props.blendAngle * DEG2RAD)
const edge0Node = uniform(props.edge0)
const edge1Node = uniform(props.edge1)
const speedNode = uniform(props.speed)

watch(() => props.colorA, v => { const c = new Color(v); colorANode.value.set(c.r, c.g, c.b) })
watch(() => props.colorB, v => { const c = new Color(v); colorBNode.value.set(c.r, c.g, c.b) })
watch(() => props.noiseScale, v => { noiseScaleNode.value = v })
watch(() => props.rotationAmount, v => { rotAmountNode.value = v * DEG2RAD })
watch(() => props.warpFrequency, v => { warpFreqNode.value = v })
watch(() => props.warpAmplitude, v => { warpAmpNode.value = v })
watch(() => props.blendAngle, v => { blendAngleNode.value = v * DEG2RAD })
watch(() => props.edge0, v => { edge0Node.value = v })
watch(() => props.edge1, v => { edge1Node.value = v })
watch(() => props.speed, v => { speedNode.value = v })

const pipeline = useShaderPipelineContext()

useShaderStage(
  () => {
    const uvCurrent = pipeline.uvNode.value
    if (!uvCurrent) return vec4(0, 0, 0, 1)

    const t = time.mul(speedNode)

    // 1. Noise-driven UV rotation
    const n = simplexNoise2D(uvCurrent.mul(noiseScaleNode).add(t))
    const angle = n.mul(0.5).add(0.5).mul(rotAmountNode).add(float(Math.PI)).sub(rotAmountNode.mul(0.5))
    const c1 = cos(angle)
    const s1 = sin(angle)
    const centered = uvCurrent.sub(0.5)
    const rotated = vec2(
      centered.x.mul(c1).sub(centered.y.mul(s1)),
      centered.x.mul(s1).add(centered.y.mul(c1)),
    ).add(0.5)

    // 2. Asymmetric sine warp — pure functional (no toVar/addAssign needed)
    // warpedY uses warpedX to replicate the sequential addAssign behaviour
    const warpedX = rotated.x.add(sin(rotated.y.mul(warpFreqNode).add(t)).div(warpAmpNode))
    const warpedY = rotated.y.add(sin(warpedX.mul(warpFreqNode.mul(1.5)).add(t)).div(warpAmpNode.mul(0.5)))
    const tuv = vec2(warpedX, warpedY)

    // 3. Rotated gradient blend
    const cb = cos(blendAngleNode)
    const sb = sin(blendAngleNode)
    const rotX = tuv.sub(0.5).x.mul(cb).sub(tuv.sub(0.5).y.mul(sb)).add(0.5)
    const blend = smoothstep(edge0Node, edge1Node, rotX)

    return vec4(mix(colorANode, colorBNode, blend), float(1))
  },
  props.order,
)
</script>

<template><!-- --></template>

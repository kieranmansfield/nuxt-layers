<script setup lang="ts">
// @ts-nocheck - TSL types are complex
import { Color, DoubleSide } from 'three'
import {
  add,
  mix,
  mul,
  pow,
  smoothstep,
  sub,
  time as tslTime,
  uniform,
  uv,
  vec2,
  vec3,
} from 'three/tsl'
import { MeshBasicNodeMaterial } from 'three/webgpu'
import { fbm2D, simplexNoise2D } from '../../shaders/common/noise'
import { cosinePalette } from '../../shaders/common/palette'

const props = withDefaults(
  defineProps<{
    speed?: number
    intensity?: number
    color1?: string
    color2?: string
    color3?: string
    mouseX?: number
    mouseY?: number
    mouseInteraction?: boolean
    mouseStrength?: number
  }>(),
  {
    speed: 1.0,
    intensity: 1.0,
    color1: '#0a0a20',
    color2: '#00ff87',
    color3: '#60efff',
    mouseX: 0.5,
    mouseY: 0.5,
    mouseInteraction: true,
    mouseStrength: 0.5,
  }
)

// Create reactive uniforms
const speedUniform = uniform(props.speed)
const intensityUniform = uniform(props.intensity)
const mouseXUniform = uniform(props.mouseX)
const mouseYUniform = uniform(props.mouseY)
const mouseStrengthUniform = uniform(props.mouseStrength)
const color1Uniform = uniform(new Color(props.color1))
const color2Uniform = uniform(new Color(props.color2))
const color3Uniform = uniform(new Color(props.color3))

// Watch prop changes
watch(
  () => props.speed,
  (val) => (speedUniform.value = val)
)
watch(
  () => props.intensity,
  (val) => (intensityUniform.value = val)
)
watch(
  () => props.mouseX,
  (val) => (mouseXUniform.value = val)
)
watch(
  () => props.mouseY,
  (val) => (mouseYUniform.value = val)
)
watch(
  () => props.mouseStrength,
  (val) => (mouseStrengthUniform.value = val)
)
watch(
  () => props.color1,
  (val) => (color1Uniform.value = new Color(val))
)
watch(
  () => props.color2,
  (val) => (color2Uniform.value = new Color(val))
)
watch(
  () => props.color3,
  (val) => (color3Uniform.value = new Color(val))
)

const material = computed(() => {
  const mat = new MeshBasicNodeMaterial()

  // Time animation
  const time = tslTime.mul(speedUniform).mul(0.2)

  // Mouse offset
  const mouseOffset = vec2(
    sub(mouseXUniform, 0.5).mul(props.mouseInteraction ? mouseStrengthUniform : 0),
    sub(mouseYUniform, 0.5).mul(props.mouseInteraction ? mouseStrengthUniform : 0)
  )

  // UV coordinates
  const uvCoord = uv()

  // Create curtain-like aurora layers using noise
  const curtain1UV = vec2(
    add(mul(uvCoord.x, 3.0), time, mouseOffset.x),
    add(mul(uvCoord.y, 0.5), mul(time, 0.3))
  )
  const curtain1 = simplexNoise2D(curtain1UV)

  const curtain2UV = vec2(
    sub(mul(uvCoord.x, 4.0), mul(time, 0.7), mul(mouseOffset.x, 0.5)),
    add(mul(uvCoord.y, 0.3), mul(time, 0.2))
  )
  const curtain2 = simplexNoise2D(curtain2UV)

  const curtain3UV = vec2(
    add(mul(uvCoord.x, 2.5), mul(time, 0.5)),
    sub(mul(uvCoord.y, 0.4), mul(time, 0.1))
  )
  const curtain3 = simplexNoise2D(curtain3UV)

  // FBM for additional detail
  const fbmUV = add(vec2(mul(uvCoord.x, 2.0), mul(uvCoord.y, 0.6)), mouseOffset, mul(time, 0.3))
  const curtain4 = fbm2D(fbmUV, { octaves: 4, lacunarity: 2.0, gain: 0.5 })

  // Vertical fade - aurora appears from bottom
  const fade = mul(pow(sub(1.0, uvCoord.y), 1.2), smoothstep(0.0, 0.3, uvCoord.y))

  // Combine curtains
  const combined = mul(
    add(mul(curtain1, 0.4), mul(curtain2, 0.3), mul(curtain3, 0.2), mul(curtain4, 0.3)),
    fade
  )
  const aurora = mul(smoothstep(-0.3, 0.8, combined), intensityUniform)

  // Cosine palette for iridescent colors
  const palette = cosinePalette(
    add(aurora, mul(time, 0.1)),
    vec3(0.2, 0.5, 0.4),
    vec3(0.2, 0.4, 0.2),
    vec3(1.0, 1.0, 0.5),
    vec3(0.0, 0.2, 0.5)
  )

  // Mix colors
  let colorNode = mix(vec3(color1Uniform), vec3(color2Uniform), aurora)
  colorNode = mix(colorNode, vec3(color3Uniform), mul(curtain2, fade, 0.5))
  colorNode = mix(colorNode, palette, mul(aurora, 0.5))

  // Add shimmer
  const shimmerUV = vec2(add(mul(uvCoord.x, 20.0), mul(time, 10.0)), mul(uvCoord.y, 5.0))
  const shimmer = mul(simplexNoise2D(shimmerUV), 0.1, aurora)
  colorNode = add(colorNode, shimmer)

  // Dark sky background
  const sky = vec3(0.02, 0.02, 0.06)
  colorNode = mix(sky, colorNode, add(aurora, 0.05))

  mat.colorNode = colorNode
  mat.side = DoubleSide

  return mat
})

defineExpose({ material })
</script>

<template>
  <primitive :object="material" attach="material" />
</template>

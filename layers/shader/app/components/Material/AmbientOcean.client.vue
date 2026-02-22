<script setup lang="ts">
// @ts-nocheck - TSL types are complex
import { Color, DoubleSide } from 'three'
import {
  add,
  exp,
  length,
  mix,
  mul,
  pow,
  sin,
  smoothstep,
  sub,
  time as tslTime,
  uniform,
  uv,
  vec2,
  vec3,
} from 'three/tsl'
import { MeshBasicNodeMaterial } from 'three/webgpu'
import { simplexNoise2D } from '../../shaders/common/noise'

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
    color1: '#0a1628',
    color2: '#1e3a5f',
    color3: '#7ec8e3',
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
  const time = tslTime.mul(speedUniform).mul(0.3)

  // UV coordinates
  const uvCoord = uv()

  // Mouse position for ripples
  const mousePos = vec2(mouseXUniform, mouseYUniform)
  const mouseDist = length(sub(uvCoord, mousePos))

  // Mouse ripple effect
  const ripple = mul(
    sin(sub(mul(mouseDist, 30.0), mul(time, 5.0))),
    exp(mul(mouseDist, -5.0)),
    props.mouseInteraction ? mouseStrengthUniform : 0
  )

  // Wave layers
  const wave1 = add(mul(sin(add(mul(uvCoord.x, 8.0), time, mul(ripple, 2.0))), 0.5), 0.5)
  const wave2 = add(
    mul(sin(add(sub(mul(uvCoord.x, 12.0), mul(time, 0.7)), mul(uvCoord.y, 3.0))), 0.5),
    0.5
  )
  const wave3 = simplexNoise2D(
    vec2(add(mul(uvCoord.x, 4.0), mul(time, 0.5)), add(mul(uvCoord.y, 2.0), mul(time, 0.3)))
  )

  // Caustics-like pattern
  const caustic1UV = add(mul(uvCoord, 10.0), mul(time, 0.5))
  const caustic1 = add(mul(simplexNoise2D(caustic1UV), 0.5), 0.5)
  const caustic2UV = add(sub(mul(uvCoord, 15.0), mul(time, 0.3)), 5.0)
  const caustic2 = add(mul(simplexNoise2D(caustic2UV), 0.5), 0.5)
  const caustics = pow(mul(caustic1, caustic2), 2.0)

  // Foam on wave peaks
  const foam = smoothstep(0.7, 0.9, mul(wave1, wave2))

  // Depth gradient
  const depth = add(mul(uvCoord.y, 0.5), 0.3)

  // Color mixing
  let colorNode = mix(vec3(color1Uniform), vec3(color2Uniform), add(depth, mul(wave3, 0.2)))
  colorNode = mix(colorNode, vec3(color3Uniform), mul(caustics, 0.3, intensityUniform))
  colorNode = add(colorNode, mul(vec3(1.0, 1.0, 1.0), foam, 0.3))

  // Add shimmer
  const shimmerUV = add(mul(uvCoord, 30.0), mul(time, 2.0))
  const shimmer = mul(simplexNoise2D(shimmerUV), 0.05, intensityUniform)
  colorNode = add(colorNode, shimmer)

  // Subtle vignette
  const dist = length(sub(uvCoord, 0.5))
  const vig = sub(1.0, mul(dist, 0.5))
  colorNode = mul(colorNode, vig)

  mat.colorNode = colorNode
  mat.side = DoubleSide

  return mat
})

defineExpose({ material })
</script>

<template>
  <primitive :object="material" attach="material" />
</template>

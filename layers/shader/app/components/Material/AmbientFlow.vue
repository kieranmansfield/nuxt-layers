<script setup lang="ts">
// @ts-nocheck - TSL types are complex
import { Color, DoubleSide } from 'three'
import {
  add,
  length,
  mix,
  mul,
  sin,
  sub,
  time as tslTime,
  uniform,
  uv,
  vec2,
  vec3,
} from 'three/tsl'
import { MeshBasicNodeMaterial } from 'three/webgpu'
import { fbm2D, ridgedFbm2d, warpedFbmCoords } from '../../shaders/common/noise'
import { cosinePalette } from '../../shaders/common/palette'

const props = withDefaults(
  defineProps<{
    speed?: number
    intensity?: number
    color1?: string
    color2?: string
    color3?: string
    color4?: string
    mouseX?: number
    mouseY?: number
    mouseInteraction?: boolean
    mouseStrength?: number
  }>(),
  {
    speed: 1.0,
    intensity: 1.0,
    color1: '#134e5e',
    color2: '#71b280',
    color3: '#e8d5b7',
    color4: '#fc5c7d',
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
const color4Uniform = uniform(new Color(props.color4))

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
watch(
  () => props.color4,
  (val) => (color4Uniform.value = new Color(val))
)

const material = computed(() => {
  const mat = new MeshBasicNodeMaterial()

  // Time animation
  const time = tslTime.mul(speedUniform).mul(0.15)

  // UV coordinates
  const uvCoord = uv()

  // Mouse offset
  const mouseOffset = vec2(
    sub(mouseXUniform, 0.5)
      .mul(props.mouseInteraction ? mouseStrengthUniform : 0)
      .mul(0.5),
    sub(mouseYUniform, 0.5)
      .mul(props.mouseInteraction ? mouseStrengthUniform : 0)
      .mul(0.5)
  )

  // Domain warping - create flowing organic patterns
  const warpedUV = warpedFbmCoords(uvCoord, time, {
    warpStrength: 0.4,
    warpScale: 2.0,
    octaves: 3,
  })

  // Add mouse influence to warped coordinates
  const finalUV = add(warpedUV, mouseOffset)

  // Layered noise on warped coordinates
  const n1 = add(
    mul(fbm2D(mul(finalUV, 2.0), { octaves: 4, lacunarity: 2.0, gain: 0.5 }), 0.5),
    0.5
  )
  const n2 = add(
    mul(fbm2D(add(mul(finalUV, 3.0), 5.0), { octaves: 3, lacunarity: 2.0, gain: 0.5 }), 0.5),
    0.5
  )
  const n3 = add(
    mul(ridgedFbm2d(mul(finalUV, 1.5), { octaves: 4, lacunarity: 2.0, gain: 0.5 }), 0.5),
    0.5
  )

  // Color palette based on noise
  let colorNode = mix(vec3(color1Uniform), vec3(color2Uniform), n1)
  colorNode = mix(colorNode, vec3(color3Uniform), mul(n2, 0.6))
  colorNode = mix(colorNode, vec3(color4Uniform), mul(n3, 0.4))

  // Add iridescent effect using cosine palette
  const iridescence = cosinePalette(
    add(n1, mul(time, 0.1)),
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(1.0, 1.0, 0.5),
    vec3(0.8, 0.9, 0.3)
  )
  colorNode = mix(colorNode, iridescence, 0.2)

  // Brightness variation
  const brightness = add(0.8, mul(0.2, sin(add(mul(n1, 6.28), time))))
  colorNode = mul(colorNode, brightness, intensityUniform)

  // Soft vignette
  const dist = length(sub(uvCoord, 0.5))
  const vig = sub(1.0, mul(dist, 0.4))
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

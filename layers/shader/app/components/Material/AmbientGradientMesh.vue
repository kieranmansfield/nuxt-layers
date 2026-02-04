<script setup lang="ts">
// @ts-nocheck - TSL types are complex
import { Color, DoubleSide } from 'three'
import {
  add,
  cos,
  length,
  mix,
  mul,
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
import { fbm2D, simplexNoise2D } from '../../shaders/common/noise'

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
    color1: '#667eea',
    color2: '#764ba2',
    color3: '#f093fb',
    color4: '#f5576c',
    mouseX: 0.5,
    mouseY: 0.5,
    mouseInteraction: true,
    mouseStrength: 0.3,
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
  const time = tslTime.mul(speedUniform).mul(0.2)

  // UV coordinates
  const uvCoord = uv()

  // Mouse offset
  const mouseOffset = vec2(
    sub(mouseXUniform, 0.5).mul(props.mouseInteraction ? mouseStrengthUniform : 0),
    sub(mouseYUniform, 0.5).mul(props.mouseInteraction ? mouseStrengthUniform : 0)
  )
  const adjustedUV = add(uvCoord, mul(mouseOffset, 0.1))

  // Create smooth flowing noise
  const n1UV = add(mul(adjustedUV, 1.5), vec2(time, mul(time, 0.5)))
  const n1 = add(mul(simplexNoise2D(n1UV), 0.5), 0.5)

  const n2UV = add(mul(adjustedUV, 2.0), vec2(mul(time, -0.7), mul(time, 0.3)))
  const n2 = add(mul(simplexNoise2D(n2UV), 0.5), 0.5)

  const n3UV = add(mul(adjustedUV, 1.2), vec2(mul(time, 0.4), mul(time, -0.6)))
  const n3 = add(mul(simplexNoise2D(n3UV), 0.5), 0.5)

  const n4 = add(
    mul(
      fbm2D(add(mul(adjustedUV, 0.8), mul(time, 0.2)), { octaves: 3, lacunarity: 2.0, gain: 0.5 }),
      0.5
    ),
    0.5
  )

  // Animated gradient positions (mesh control points)
  const p1 = vec2(add(0.2, mul(sin(mul(time, 0.5)), 0.2)), add(0.3, mul(cos(mul(time, 0.4)), 0.2)))
  const p2 = vec2(
    add(0.8, mul(cos(mul(time, 0.6)), 0.15)),
    add(0.2, mul(sin(mul(time, 0.5)), 0.15))
  )
  const p3 = vec2(add(0.3, mul(sin(mul(time, 0.7)), 0.2)), add(0.8, mul(cos(mul(time, 0.3)), 0.15)))
  const p4 = vec2(add(0.7, mul(cos(mul(time, 0.4)), 0.2)), add(0.7, mul(sin(mul(time, 0.6)), 0.2)))

  // Distance-based blending from each control point
  const d1 = sub(1.0, smoothstep(0.0, 0.8, length(sub(adjustedUV, p1))))
  const d2 = sub(1.0, smoothstep(0.0, 0.8, length(sub(adjustedUV, p2))))
  const d3 = sub(1.0, smoothstep(0.0, 0.8, length(sub(adjustedUV, p3))))
  const d4 = sub(1.0, smoothstep(0.0, 0.8, length(sub(adjustedUV, p4))))

  // Color mixing based on distance and noise
  let colorNode = mul(vec3(color1Uniform), d1)
  colorNode = mix(colorNode, vec3(color2Uniform), mul(d2, n1))
  colorNode = mix(colorNode, vec3(color3Uniform), mul(d3, n2))
  colorNode = mix(colorNode, vec3(color4Uniform), mul(d4, n3))

  // Add subtle brightness variation
  const brightness = add(0.9, mul(0.1, n4))
  colorNode = mul(colorNode, brightness, intensityUniform)

  // Soft vignette
  const dist = length(sub(uvCoord, 0.5))
  const vig = sub(1.0, mul(dist, 0.3))
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

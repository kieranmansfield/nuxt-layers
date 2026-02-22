<script setup lang="ts">
import { Color, DoubleSide } from 'three'
import {
  dot,
  float,
  mix,
  normalize,
  normalView,
  positionViewDirection,
  pow,
  uniform,
  vec3,
} from 'three/tsl'
import { MeshBasicNodeMaterial } from 'three/webgpu'

const props = withDefaults(
  defineProps<{
    baseColor?: string
    fresnelColor?: string
    power?: number
    intensity?: number
    transparent?: boolean
  }>(),
  {
    baseColor: '#1e1b4b',
    fresnelColor: '#22d3ee',
    power: 2,
    intensity: 1,
    transparent: false,
  }
)

// Create reactive uniforms
const baseColorUniform = uniform(new Color(props.baseColor))
const fresnelColorUniform = uniform(new Color(props.fresnelColor))
const powerUniform = uniform(props.power)
const intensityUniform = uniform(props.intensity)

// Watch prop changes
watch(
  () => props.baseColor,
  (val) => {
    baseColorUniform.value = new Color(val)
  }
)
watch(
  () => props.fresnelColor,
  (val) => {
    fresnelColorUniform.value = new Color(val)
  }
)
watch(
  () => props.power,
  (val) => {
    powerUniform.value = val
  }
)
watch(
  () => props.intensity,
  (val) => {
    intensityUniform.value = val
  }
)

const material = computed(() => {
  const mat = new MeshBasicNodeMaterial()

  // Calculate fresnel with reactive uniforms
  const viewDir = normalize(positionViewDirection.negate())
  const normal = normalize(normalView)
  const nDotV = dot(normal, viewDir).clamp(0, 1)
  const fresnelFactor = pow(float(1).sub(nDotV), powerUniform).mul(intensityUniform)

  // Mix colors based on fresnel using reactive uniforms
  const colorNode = mix(vec3(baseColorUniform), vec3(fresnelColorUniform), fresnelFactor)

  mat.colorNode = colorNode as any
  mat.transparent = props.transparent
  mat.side = DoubleSide

  return mat
})

defineExpose({ material })
</script>

<template>
  <primitive :object="material" attach="material" />
</template>

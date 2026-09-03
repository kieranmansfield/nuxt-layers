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

  import type { TSLNode } from '../../shaders/types'

  const {
    baseColor = '#1e1b4b',
    fresnelColor = '#22d3ee',
    power = 2,
    intensity = 1,
    transparent = false,
  } = defineProps<{
    baseColor?: string
    fresnelColor?: string
    power?: number
    intensity?: number
    transparent?: boolean
  }>()

  // Create reactive uniforms
  const baseColorUniform: TSLNode = uniform(new Color(baseColor))
  const fresnelColorUniform: TSLNode = uniform(new Color(fresnelColor))
  const powerUniform = uniform(power)
  const intensityUniform = uniform(intensity)

  // Watch prop changes
  watch(
    () => baseColor,
    (val) => {
      baseColorUniform.value = new Color(val)
    }
  )
  watch(
    () => fresnelColor,
    (val) => {
      fresnelColorUniform.value = new Color(val)
    }
  )
  watch(
    () => power,
    (val) => {
      powerUniform.value = val
    }
  )
  watch(
    () => intensity,
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

    mat.colorNode = colorNode as TSLNode
    mat.transparent = transparent
    mat.side = DoubleSide

    return mat
  })

  defineExpose({ material })
</script>

<template>
  <primitive :object="material" attach="material" />
</template>

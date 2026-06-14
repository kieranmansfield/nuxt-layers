<script setup lang="ts">
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
  import type { TSLNode } from '../../shaders/types'

  const {
    speed = 1.0,
    intensity = 1.0,
    color1 = '#134e5e',
    color2 = '#71b280',
    color3 = '#e8d5b7',
    color4 = '#fc5c7d',
    mouseX = 0.5,
    mouseY = 0.5,
    mouseInteraction = true,
    mouseStrength = 0.5,
  } = defineProps<{
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
  }>()

  // Create reactive uniforms
  const speedUniform = uniform(speed)
  const intensityUniform = uniform(intensity)
  const mouseXUniform = uniform(mouseX)
  const mouseYUniform = uniform(mouseY)
  const mouseStrengthUniform = uniform(mouseStrength)
  const color1Uniform: TSLNode = uniform(new Color(color1))
  const color2Uniform: TSLNode = uniform(new Color(color2))
  const color3Uniform: TSLNode = uniform(new Color(color3))
  const color4Uniform: TSLNode = uniform(new Color(color4))

  // Watch prop changes
  watch(
    () => speed,
    (val) => (speedUniform.value = val)
  )
  watch(
    () => intensity,
    (val) => (intensityUniform.value = val)
  )
  watch(
    () => mouseX,
    (val) => (mouseXUniform.value = val)
  )
  watch(
    () => mouseY,
    (val) => (mouseYUniform.value = val)
  )
  watch(
    () => mouseStrength,
    (val) => (mouseStrengthUniform.value = val)
  )
  watch(
    () => color1,
    (val) => (color1Uniform.value = new Color(val))
  )
  watch(
    () => color2,
    (val) => (color2Uniform.value = new Color(val))
  )
  watch(
    () => color3,
    (val) => (color3Uniform.value = new Color(val))
  )
  watch(
    () => color4,
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
        .mul(mouseInteraction ? mouseStrengthUniform : 0)
        .mul(0.5),
      sub(mouseYUniform, 0.5)
        .mul(mouseInteraction ? mouseStrengthUniform : 0)
        .mul(0.5)
    )

    // Domain warping - create flowing organic patterns
    // warpedFbmCoords has no warp-strength options — defaults match the previous render output
    const warpedUV = warpedFbmCoords(uvCoord, time)

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

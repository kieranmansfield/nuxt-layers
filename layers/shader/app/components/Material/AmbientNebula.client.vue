<script setup lang="ts">
  import { Color, DoubleSide } from 'three'
  import {
    add,
    exp,
    length,
    mix,
    mul,
    smoothstep,
    sub,
    time as tslTime,
    uniform,
    uv,
    vec2,
    vec3,
  } from 'three/tsl'
  import { MeshBasicNodeMaterial } from 'three/webgpu'

  import { fbm3D, hash21, ridgedFbm2d, voronoi2D } from '../../shaders/common/noise'
  import { cosinePalette } from '../../shaders/common/palette'
  import type { TSLNode } from '../../shaders/types'
  import { watchUniformProp } from '#layers/shader/app/composables/useUniformWatchers'

  const {
    // fallow-ignore-next-line code-duplication
    speed = 1.0,
    intensity = 1.0,
    color1 = '#1a0a2e',
    color2 = '#ff6b6b',
    color3 = '#4ecdc4',
    color4 = '#ffe66d',
    mouseX = 0.5,
    mouseY = 0.5,
    mouseInteraction = true,
    mouseStrength = 0.3,
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

  watchUniformProp(() => speed, speedUniform)
  watchUniformProp(() => intensity, intensityUniform)
  watchUniformProp(() => mouseX, mouseXUniform)
  watchUniformProp(() => mouseY, mouseYUniform)
  watchUniformProp(() => mouseStrength, mouseStrengthUniform)
  watchUniformProp(() => color1, color1Uniform, (val) => new Color(val))
  watchUniformProp(() => color2, color2Uniform, (val) => new Color(val))
  watchUniformProp(() => color3, color3Uniform, (val) => new Color(val))
  // fallow-ignore-next-line code-duplication
  watchUniformProp(() => color4, color4Uniform, (val) => new Color(val))

  const material = computed(() => {
    const mat = new MeshBasicNodeMaterial()

    // Time animation
    const time = tslTime.mul(speedUniform).mul(0.15)

    // UV centered at origin
    const uvCoord = sub(uv(), 0.5)

    // Mouse offset
    const mouseOffset = vec2(
      sub(mouseXUniform, 0.5).mul(mouseInteraction ? mouseStrengthUniform : 0),
      sub(mouseYUniform, 0.5).mul(mouseInteraction ? mouseStrengthUniform : 0)
    )
    const adjustedUV = add(uvCoord, mouseOffset)

    // Multiple noise layers for depth
    const n1Pos = vec3(mul(adjustedUV.x, 2.0), mul(adjustedUV.y, 2.0), mul(time, 0.5))
    const n1 = add(mul(fbm3D(n1Pos, { octaves: 5, lacunarity: 2.0, gain: 0.5 }), 0.5), 0.5)

    const n2Pos = vec3(
      add(mul(adjustedUV.x, 3.0), 10.0),
      add(mul(adjustedUV.y, 3.0), 10.0),
      mul(time, 0.3)
    )
    const n2 = add(mul(fbm3D(n2Pos, { octaves: 4, lacunarity: 2.0, gain: 0.5 }), 0.5), 0.5)

    const n3 = add(
      mul(
        ridgedFbm2d(add(mul(adjustedUV, 4.0), mul(time, 0.2)), {
          octaves: 4,
          lacunarity: 2.0,
          gain: 0.5,
        }),
        0.5
      ),
      0.5
    )

    // Voronoi for stars/clusters
    const vor = voronoi2D(add(mul(adjustedUV, 8.0), mul(time, 0.1)), 1.0)
    const stars = mul(smoothstep(0.1, 0.0, vor.distance), hash21(vor.cellId))

    // Color layers
    const layer1 = mix(vec3(color1Uniform), vec3(color2Uniform), n1)
    const layer2 = mix(vec3(color3Uniform), vec3(color4Uniform), n2)

    // Cosine palette for extra color variation
    const palette = cosinePalette(
      n3,
      vec3(0.5, 0.5, 0.5),
      vec3(0.5, 0.5, 0.5),
      vec3(1.0, 0.7, 0.4),
      vec3(0.0, 0.15, 0.2)
    )

    // Combine layers
    let colorNode = mix(layer1, layer2, mul(n2, 0.7))
    colorNode = mix(colorNode, palette, mul(n3, 0.4))

    // Add central glow
    const dist = length(uvCoord)
    const glow = mul(exp(mul(dist, -2.0)), 0.5)
    colorNode = add(colorNode, mul(vec3(color2Uniform), glow))

    // Add stars
    colorNode = add(colorNode, mul(vec3(1.0, 0.95, 0.9), stars, 2.0))

    // Vignette
    const vig = sub(1.0, mul(dist, 0.8))
    colorNode = mul(colorNode, vig, intensityUniform)

    mat.colorNode = colorNode
    mat.side = DoubleSide

    return mat
  })

  defineExpose({ material })
</script>

<template>
  <primitive :object="material" attach="material" />
</template>

<script setup lang="ts">
  import {
    fbm2D,
    fbm3dSimplex,
    ridgedFbm2d,
    simplexNoise2D,
    voronoi2D,
  } from '#layers/shader/app/shaders/common/noise'
  import { add, mul, time, uniform, uv, vec2, vec3 } from 'three/tsl'

  const {
    id = 'noise',
    type = 'simplex',
    scale = 3.0,
    speed = 0.2,
    octaves = 4,
    order = 0,
    blend = 'normal',
    opacity = 1.0,
  } = defineProps<{
    id?: string
    type?: 'simplex' | 'fbm' | 'voronoi' | 'ridged' | 'fbm3d'
    scale?: number
    speed?: number
    octaves?: number
    order?: number
    blend?: 'normal' | 'add' | 'multiply' | 'screen' | 'overlay' | 'mix'
    opacity?: number
  }>()

  const graph = useShaderGraphContext()

  // Create uniforms once
  const uScale = uniform(scale)
  const uSpeed = uniform(speed)

  // Build TSL node
  function buildNode() {
    const uvCoord = uv()
    const t = mul(time, uSpeed)
    const scaledUV = mul(uvCoord, uScale)
    const animatedUV = add(scaledUV, vec2(t, mul(t, 0.3)))

    let noiseValue

    switch (type) {
      case 'fbm':
        noiseValue = fbm2D(animatedUV, { octaves, frequency: 1.0 }).mul(0.5).add(0.5)
        break
      case 'voronoi': {
        const { distance } = voronoi2D(animatedUV, 1.0)
        noiseValue = distance
        break
      }
      case 'ridged':
        noiseValue = ridgedFbm2d(animatedUV, { octaves, frequency: 1.0 })
        break
      case 'fbm3d':
        noiseValue = fbm3dSimplex(vec3(scaledUV, t), { octaves }).mul(0.5).add(0.5)
        break
      case 'simplex':
      default:
        noiseValue = simplexNoise2D(animatedUV).mul(0.5).add(0.5)
        break
    }

    return vec3(noiseValue, noiseValue, noiseValue)
  }

  const node = buildNode()
  graph.register(id, node, order, blend, opacity)

  // Watch uniform-driven props (no recompilation)
  watch(
    () => scale,
    (v) => {
      uScale.value = v
    }
  )
  watch(
    () => speed,
    (v) => {
      uSpeed.value = v
    }
  )

  // Watch topology-changing props (requires graph update)
  watch(
    () => [type, octaves] as const,
    () => {
      const newNode = buildNode()
      graph.update(id, newNode)
    }
  )

  onUnmounted(() => {
    graph.unregister(id)
  })
</script>

<template>
  <slot />
</template>

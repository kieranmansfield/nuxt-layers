<script setup lang="ts">
  import {
    createAmbientUniforms,
    createThemeBubbleColorNode,
    createThemeGradientColorNode,
    createThemeLavaLampColorNode,
    createThemePlasmaColorNode,
    createThemeWaveColorNode,
    type AmbientUniforms,
    type ThemeColorUniforms,
  } from '#layers/shader/app/composables/useAmbientMaterials'
  import type { TSLNode } from '#layers/shader/app/types/tsl'
  import { Color, DoubleSide, Vector3 } from 'three'
  import { uniform } from 'three/tsl'
  import { MeshBasicNodeMaterial } from 'three/webgpu'

  type ThemeId = 'mesh' | 'wave' | 'lavalamp' | 'bubble' | 'plasma'

  const {
    themeId,
    speed = 1,
    intensity = 1,
    color1 = '#8b5cf6',
    color2 = '#6366f1',
    color3 = '#a78bfa',
    color4 = '#38bdf8',
  } = defineProps<{
    themeId: ThemeId
    speed?: number
    intensity?: number
    color1?: string
    color2?: string
    color3?: string
    color4?: string
  }>()

  function hexToVec3Uniform(hex: string) {
    const c = new Color(hex)
    return uniform(new Vector3(c.r, c.g, c.b))
  }

  function makeColorUniforms() {
    return {
      color1: hexToVec3Uniform(color1),
      color2: hexToVec3Uniform(color2),
      color3: hexToVec3Uniform(color3),
      color4: hexToVec3Uniform(color4),
    }
  }

  const NODE_CREATORS: Record<ThemeId, (u: AmbientUniforms, c: ThemeColorUniforms) => TSLNode> = {
    mesh: createThemeGradientColorNode,
    wave: createThemeWaveColorNode,
    lavalamp: createThemeLavaLampColorNode,
    bubble: createThemeBubbleColorNode,
    plasma: createThemePlasmaColorNode,
  }

  // Mutable refs so color watchers update without material rebuild
  let colorUniforms = makeColorUniforms()
  let ambientUniforms = createAmbientUniforms({
    speed: speed,
    intensity: intensity,
    mouseInteraction: false,
  })

  function buildMaterial() {
    const colorNode = NODE_CREATORS[themeId](ambientUniforms, colorUniforms)
    const mat = new MeshBasicNodeMaterial()
    mat.side = DoubleSide
    mat.colorNode = colorNode
    return mat
  }

  const material = shallowRef(buildMaterial())

  // Rebuild material + uniforms when preset switches
  watch(
    () => themeId,
    () => {
      colorUniforms = makeColorUniforms()
      ambientUniforms = createAmbientUniforms({
        speed: speed,
        intensity: intensity,
        mouseInteraction: false,
      })
      const old = material.value
      material.value = buildMaterial()
      nextTick(() => old?.dispose())
    }
  )

  // Update color uniforms reactively (no material rebuild)
  watch(
    () => color1,
    (v) => {
      const c = new Color(v)
      colorUniforms.color1.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => color2,
    (v) => {
      const c = new Color(v)
      colorUniforms.color2.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => color3,
    (v) => {
      const c = new Color(v)
      colorUniforms.color3.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => color4,
    (v) => {
      const c = new Color(v)
      colorUniforms.color4.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => speed,
    (v) => {
      ambientUniforms.speed.value = v
    }
  )
  watch(
    () => intensity,
    (v) => {
      ambientUniforms.intensity.value = v
    }
  )

  onUnmounted(() => material.value?.dispose())
</script>

<template>
  <ShaderCanvas webgpu clear-color="#0a0a0a" :window-size="false" tone-mapping="aces">
    <TresOrthographicCamera :args="[-1, 1, 1, -1, 0.1, 100]" :position="[0, 0, 1]" />
    <TresMesh>
      <TresPlaneGeometry :args="[2, 2]" />
      <primitive :object="material" attach="material" />
    </TresMesh>
  </ShaderCanvas>
</template>

<script setup lang="ts">
  import {
    createThemeBubbleColorNode,
    createThemeGradientColorNode,
    createThemeLavaLampColorNode,
    createThemePlasmaColorNode,
    createThemeWaveColorNode,
    type AmbientUniforms,
    type ThemeColorUniforms,
  } from '#layers/shader/app/composables/useAmbientMaterials'
  import type { TSLNode } from '#layers/shader/app/types/tsl'
  import { DoubleSide } from 'three'
  import { MeshBasicNodeMaterial } from 'three/webgpu'

  import { useThemeNodeUniforms } from '~/composables/useThemeNodeUniforms'

  type ThemeId = 'mesh' | 'wave' | 'lavalamp' | 'bubble' | 'plasma'

  const { themeId, speed, intensity, color1, color2, color3, color4 } = defineProps<{
    themeId: ThemeId
    speed?: number
    intensity?: number
    color1?: string
    color2?: string
    color3?: string
    color4?: string
  }>()

  const { colorUniforms, ambientUniforms } = useThemeNodeUniforms({
    get speed() {
      return speed
    },
    get intensity() {
      return intensity
    },
    get color1() {
      return color1
    },
    get color2() {
      return color2
    },
    get color3() {
      return color3
    },
    get color4() {
      return color4
    },
  })

  const NODE_CREATORS: Record<ThemeId, (u: AmbientUniforms, c: ThemeColorUniforms) => TSLNode> = {
    mesh: createThemeGradientColorNode,
    wave: createThemeWaveColorNode,
    lavalamp: createThemeLavaLampColorNode,
    bubble: createThemeBubbleColorNode,
    plasma: createThemePlasmaColorNode,
  }

  function buildMaterial() {
    const colorNode = NODE_CREATORS[themeId](ambientUniforms, colorUniforms)
    const mat = new MeshBasicNodeMaterial()
    mat.side = DoubleSide
    mat.colorNode = colorNode
    return mat
  }

  const material = shallowRef(buildMaterial())

  watch(
    () => themeId,
    () => {
      const old = material.value
      material.value = buildMaterial()
      nextTick(() => old?.dispose())
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

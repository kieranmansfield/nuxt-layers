<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3, DoubleSide } from 'three'
import { uniform } from 'three/tsl'
import { MeshBasicNodeMaterial } from 'three/webgpu'
import {
  createAmbientUniforms,
  createThemeGradientColorNode,
  createThemeWaveColorNode,
  createThemeLavaLampColorNode,
  createThemeBubbleColorNode,
  createThemePlasmaColorNode,
} from '#layers/shader/app/composables/useAmbientMaterials'

type ThemeId = 'mesh' | 'wave' | 'lavalamp' | 'bubble' | 'plasma'

const props = withDefaults(defineProps<{
  themeId: ThemeId
  speed?: number
  intensity?: number
  color1?: string
  color2?: string
  color3?: string
  color4?: string
}>(), { speed: 1, intensity: 1, color1: '#8b5cf6', color2: '#6366f1', color3: '#a78bfa', color4: '#38bdf8' })

function hexToVec3Uniform(hex: string) {
  const c = new Color(hex)
  return uniform(new Vector3(c.r, c.g, c.b))
}

function makeColorUniforms() {
  return {
    color1: hexToVec3Uniform(props.color1),
    color2: hexToVec3Uniform(props.color2),
    color3: hexToVec3Uniform(props.color3),
    color4: hexToVec3Uniform(props.color4),
  }
}

const NODE_CREATORS: Record<ThemeId, (u: any, c: any) => any> = {
  mesh: createThemeGradientColorNode,
  wave: createThemeWaveColorNode,
  lavalamp: createThemeLavaLampColorNode,
  bubble: createThemeBubbleColorNode,
  plasma: createThemePlasmaColorNode,
}

// Mutable refs so color watchers update without material rebuild
let colorUniforms = makeColorUniforms()
let ambientUniforms = createAmbientUniforms({ speed: props.speed, intensity: props.intensity, mouseInteraction: false })

function buildMaterial() {
  const colorNode = NODE_CREATORS[props.themeId](ambientUniforms, colorUniforms)
  const mat = new MeshBasicNodeMaterial()
  mat.side = DoubleSide
  mat.colorNode = colorNode
  return mat
}

const material = shallowRef(buildMaterial())

// Rebuild material + uniforms when preset switches
watch(() => props.themeId, () => {
  colorUniforms = makeColorUniforms()
  ambientUniforms = createAmbientUniforms({ speed: props.speed, intensity: props.intensity, mouseInteraction: false })
  const old = material.value
  material.value = buildMaterial()
  nextTick(() => old?.dispose())
})

// Update color uniforms reactively (no material rebuild)
watch(() => props.color1, v => { const c = new Color(v); colorUniforms.color1.value.set(c.r, c.g, c.b) })
watch(() => props.color2, v => { const c = new Color(v); colorUniforms.color2.value.set(c.r, c.g, c.b) })
watch(() => props.color3, v => { const c = new Color(v); colorUniforms.color3.value.set(c.r, c.g, c.b) })
watch(() => props.color4, v => { const c = new Color(v); colorUniforms.color4.value.set(c.r, c.g, c.b) })
watch(() => props.speed, v => { ambientUniforms.speed.value = v })
watch(() => props.intensity, v => { ambientUniforms.intensity.value = v })

onUnmounted(() => material.value?.dispose())
</script>

<template>
  <ShaderCanvas :webgpu="true" clear-color="#0a0a0a" :window-size="false" tone-mapping="aces">
    <TresOrthographicCamera :args="[-1, 1, 1, -1, 0.1, 100]" :position="[0, 0, 1]" />
    <TresMesh>
      <TresPlaneGeometry :args="[2, 2]" />
      <primitive :object="material" attach="material" />
    </TresMesh>
  </ShaderCanvas>
</template>

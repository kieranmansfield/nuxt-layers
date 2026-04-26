<script setup lang="ts">
// @ts-nocheck
import { Color, Vector3 } from 'three'
import { uniform } from 'three/tsl'
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

function hex(h: string) {
  const c = new Color(h)
  return uniform(new Vector3(c.r, c.g, c.b))
}

const colorUniforms = { color1: hex(props.color1), color2: hex(props.color2), color3: hex(props.color3), color4: hex(props.color4) }
const ambientUniforms = createAmbientUniforms({ speed: props.speed, intensity: props.intensity, mouseInteraction: false })

watch(() => props.color1, v => { const c = new Color(v); colorUniforms.color1.value.set(c.r, c.g, c.b) })
watch(() => props.color2, v => { const c = new Color(v); colorUniforms.color2.value.set(c.r, c.g, c.b) })
watch(() => props.color3, v => { const c = new Color(v); colorUniforms.color3.value.set(c.r, c.g, c.b) })
watch(() => props.color4, v => { const c = new Color(v); colorUniforms.color4.value.set(c.r, c.g, c.b) })
watch(() => props.speed, v => { ambientUniforms.speed.value = v })
watch(() => props.intensity, v => { ambientUniforms.intensity.value = v })

const creators: Record<ThemeId, (u: any, c: any) => any> = {
  mesh: createThemeGradientColorNode,
  wave: createThemeWaveColorNode,
  lavalamp: createThemeLavaLampColorNode,
  bubble: createThemeBubbleColorNode,
  plasma: createThemePlasmaColorNode,
}

const colorNode = (creators[props.themeId] ?? creators.mesh)(ambientUniforms, colorUniforms)

useShaderStage(() => colorNode, 0)
</script>

<template><!-- --></template>

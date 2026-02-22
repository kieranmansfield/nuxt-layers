<script setup lang="ts">
// @ts-nocheck - TSL types
import { DoubleSide } from 'three'
import { MeshBasicNodeMaterial } from 'three/webgpu'

const props = withDefaults(
  defineProps<{
    transparent?: boolean
    side?: 'front' | 'back' | 'double'
  }>(),
  {
    transparent: false,
    side: 'double',
  }
)

// Create the shader graph context for child nodes
const graph = useShaderGraph()

// Create material ONCE in setup -- never recreated
const material = new MeshBasicNodeMaterial()
material.side = DoubleSide

if (props.transparent) {
  material.transparent = true
}

// Watch graph topology changes and update material's colorNode
watch(
  graph.version,
  () => {
    const node = graph.finalNode.value
    if (node) {
      material.colorNode = node
      material.needsUpdate = true
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  material.dispose()
})
</script>

<template>
  <primitive :object="material" attach="material" />
  <slot />
</template>

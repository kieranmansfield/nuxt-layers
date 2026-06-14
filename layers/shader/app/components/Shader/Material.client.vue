<script setup lang="ts">
  import { BackSide, DoubleSide, FrontSide } from 'three'
  import { MeshBasicNodeMaterial } from 'three/webgpu'

  const { transparent = false, side = 'double' } = defineProps<{
    transparent?: boolean
    side?: 'front' | 'back' | 'double'
  }>()

  // Create the shader graph context for child nodes
  const graph = useShaderGraph()

  // Create material ONCE in setup -- never recreated
  const material = new MeshBasicNodeMaterial()
  const sideMap = { front: FrontSide, back: BackSide, double: DoubleSide } as const
  material.side = sideMap[side]

  if (transparent) {
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

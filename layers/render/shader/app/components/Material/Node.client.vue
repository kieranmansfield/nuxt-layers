<script setup lang="ts">
  import { BackSide, DoubleSide, FrontSide } from 'three'
  import { MeshBasicNodeMaterial, MeshStandardNodeMaterial } from 'three/webgpu'

  import type { TSLNode } from '../../types'

  const {
    type = 'basic',
    colorNode = undefined,
    opacityNode = undefined,
    normalNode = undefined,
    emissiveNode = undefined,
    metalnessNode = undefined,
    roughnessNode = undefined,
    positionNode = undefined,
    transparent = false,
    side = 'front',
    wireframe = false,
    flatShading = false,
    depthTest = true,
    depthWrite = true,
  } = defineProps<{
    type?: 'basic' | 'standard'
    colorNode?: TSLNode
    opacityNode?: TSLNode
    normalNode?: TSLNode
    emissiveNode?: TSLNode
    metalnessNode?: TSLNode
    roughnessNode?: TSLNode
    positionNode?: TSLNode
    transparent?: boolean
    side?: 'front' | 'back' | 'double'
    wireframe?: boolean
    flatShading?: boolean
    depthTest?: boolean
    depthWrite?: boolean
  }>()

  const sideMap = {
    front: FrontSide,
    back: BackSide,
    double: DoubleSide,
  }

  function createMaterialInstance() {
    return type === 'standard' ? new MeshStandardNodeMaterial() : new MeshBasicNodeMaterial()
  }

  // fallow-ignore-next-line complexity
  function applyNodeProperties(mat: MeshBasicNodeMaterial | MeshStandardNodeMaterial) {
    if (colorNode) mat.colorNode = colorNode
    if (opacityNode) {
      mat.opacityNode = opacityNode
      mat.transparent = true
    }
    if (normalNode) mat.normalNode = normalNode
    if (positionNode) mat.positionNode = positionNode
  }

  // fallow-ignore-next-line complexity
  function applyStandardProperties(mat: MeshBasicNodeMaterial | MeshStandardNodeMaterial) {
    if (mat instanceof MeshStandardNodeMaterial) {
      if (emissiveNode) mat.emissiveNode = emissiveNode
      if (metalnessNode) mat.metalnessNode = metalnessNode
      if (roughnessNode) mat.roughnessNode = roughnessNode
      mat.flatShading = flatShading
    }
  }

  function applySharedProperties(mat: MeshBasicNodeMaterial | MeshStandardNodeMaterial) {
    mat.transparent = transparent || !!opacityNode
    mat.side = sideMap[side]
    mat.wireframe = wireframe
    mat.depthTest = depthTest
    mat.depthWrite = depthWrite

    return mat
  }

  const material = computed(() => {
    const mat = createMaterialInstance()
    applyNodeProperties(mat)
    applyStandardProperties(mat)
    applySharedProperties(mat)
    return mat
  })

  // Expose material for parent access
  defineExpose({ material })
</script>

<template>
  <TresMeshBasicMaterial v-if="type === 'basic'" v-bind="material" />
  <TresMeshStandardMaterial v-else v-bind="material" />
</template>

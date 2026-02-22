<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
import { BackSide, DoubleSide, FrontSide } from 'three'
import { MeshBasicNodeMaterial, MeshStandardNodeMaterial } from 'three/webgpu'
import type { TSLNode } from '../../types'

const props = withDefaults(
  defineProps<{
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
  }>(),
  {
    type: 'basic',
    transparent: false,
    side: 'front',
    wireframe: false,
    flatShading: false,
    depthTest: true,
    depthWrite: true,
  }
)

const sideMap = {
  front: FrontSide,
  back: BackSide,
  double: DoubleSide,
}

const material = computed(() => {
  const mat =
    props.type === 'standard' ? new MeshStandardNodeMaterial() : new MeshBasicNodeMaterial()

  // Apply node properties
  if (props.colorNode) mat.colorNode = props.colorNode
  if (props.opacityNode) {
    mat.opacityNode = props.opacityNode
    mat.transparent = true
  }
  if (props.normalNode) mat.normalNode = props.normalNode
  if (props.positionNode) mat.positionNode = props.positionNode

  // Standard material specific
  if (mat instanceof MeshStandardNodeMaterial) {
    if (props.emissiveNode) mat.emissiveNode = props.emissiveNode
    if (props.metalnessNode) mat.metalnessNode = props.metalnessNode
    if (props.roughnessNode) mat.roughnessNode = props.roughnessNode
    mat.flatShading = props.flatShading
  }

  // Standard properties
  mat.transparent = props.transparent || !!props.opacityNode
  mat.side = sideMap[props.side]
  mat.wireframe = props.wireframe
  mat.depthTest = props.depthTest
  mat.depthWrite = props.depthWrite

  return mat
})

// Expose material for parent access
defineExpose({ material })
</script>

<template>
  <TresMeshBasicMaterial v-if="type === 'basic'" v-bind="material" />
  <TresMeshStandardMaterial v-else v-bind="material" />
</template>

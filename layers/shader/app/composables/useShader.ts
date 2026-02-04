/* eslint-disable no-restricted-imports */
import { MeshBasicNodeMaterial, MeshStandardNodeMaterial } from 'three/webgpu'
import { onUnmounted, shallowRef } from 'vue'
import type { NodeMaterialConfig, TSLNode } from '../types'

export type ShaderMaterialType = 'basic' | 'standard'

export interface UseShaderOptions {
  type?: ShaderMaterialType
  config?: NodeMaterialConfig
  autoDispose?: boolean
}

/**
 * Main shader management composable
 */
export function useShader(options: UseShaderOptions = {}) {
  const { type = 'basic', config = {}, autoDispose = true } = options

  const material = shallowRef<MeshBasicNodeMaterial | MeshStandardNodeMaterial | null>(null)
  const isReady = ref(false)
  const error = ref<Error | null>(null)

  function createMaterial() {
    try {
      if (type === 'standard') {
        material.value = new MeshStandardNodeMaterial()
      } else {
        material.value = new MeshBasicNodeMaterial()
      }

      applyConfig(config)
      isReady.value = true
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
    }
  }

  function applyConfig(newConfig: NodeMaterialConfig) {
    if (!material.value) return

    const mat = material.value

    if (newConfig.colorNode !== undefined) mat.colorNode = newConfig.colorNode
    if (newConfig.opacityNode !== undefined) mat.opacityNode = newConfig.opacityNode
    if (newConfig.normalNode !== undefined) mat.normalNode = newConfig.normalNode

    if (mat instanceof MeshStandardNodeMaterial) {
      if (newConfig.emissiveNode !== undefined) mat.emissiveNode = newConfig.emissiveNode
      if (newConfig.metalnessNode !== undefined) mat.metalnessNode = newConfig.metalnessNode
      if (newConfig.roughnessNode !== undefined) mat.roughnessNode = newConfig.roughnessNode
    }

    if (newConfig.positionNode !== undefined) mat.positionNode = newConfig.positionNode

    // Standard material properties
    if (newConfig.transparent !== undefined) mat.transparent = newConfig.transparent
    if (newConfig.side !== undefined) mat.side = newConfig.side
    if (newConfig.blending !== undefined) mat.blending = newConfig.blending
    if (newConfig.depthTest !== undefined) mat.depthTest = newConfig.depthTest
    if (newConfig.depthWrite !== undefined) mat.depthWrite = newConfig.depthWrite
    if (newConfig.wireframe !== undefined) mat.wireframe = newConfig.wireframe

    // flatShading only exists on MeshStandardNodeMaterial
    if (mat instanceof MeshStandardNodeMaterial && newConfig.flatShading !== undefined) {
      mat.flatShading = newConfig.flatShading
    }
  }

  function setColorNode(node: TSLNode) {
    if (material.value) {
      material.value.colorNode = node
      material.value.needsUpdate = true
    }
  }

  function setOpacityNode(node: TSLNode) {
    if (material.value) {
      material.value.opacityNode = node
      material.value.transparent = true
      material.value.needsUpdate = true
    }
  }

  function setPositionNode(node: TSLNode) {
    if (material.value) {
      material.value.positionNode = node
      material.value.needsUpdate = true
    }
  }

  function dispose() {
    if (material.value) {
      material.value.dispose()
      material.value = null
      isReady.value = false
    }
  }

  // Create material on init
  createMaterial()

  // Auto dispose on unmount
  if (autoDispose) {
    onUnmounted(() => {
      dispose()
    })
  }

  return {
    material,
    isReady: readonly(isReady),
    error: readonly(error),
    applyConfig,
    setColorNode,
    setOpacityNode,
    setPositionNode,
    dispose,
  }
}

/**
 * Create a basic node material with a color node
 */
export function useBasicShader(
  colorNode?: TSLNode,
  config?: Omit<NodeMaterialConfig, 'colorNode'>
) {
  const shader = useShader({
    type: 'basic',
    config: {
      ...config,
      colorNode,
    },
  })

  return shader
}

/**
 * Create a standard (PBR) node material
 */
export function useStandardShader(config?: NodeMaterialConfig) {
  return useShader({
    type: 'standard',
    config,
  })
}

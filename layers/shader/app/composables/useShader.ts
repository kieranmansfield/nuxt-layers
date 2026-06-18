import { onUnmounted, shallowRef } from 'vue'
import { MeshBasicNodeMaterial, MeshStandardNodeMaterial } from 'three/webgpu'

import type { NodeMaterialConfig, TSLNode } from '../types'

export type ShaderMaterialType = 'basic' | 'standard'

export type UseShaderOptions = {
  type?: ShaderMaterialType
  config?: NodeMaterialConfig
  autoDispose?: boolean
}

function assignIfDefined<T extends object, K extends keyof T>(
  target: T,
  key: K,
  value: T[K] | undefined
) {
  if (value !== undefined) {
    target[key] = value
  }
}

function applyStandardMaterialConfig(
  material: MeshStandardNodeMaterial,
  config: NodeMaterialConfig
) {
  assignIfDefined(material, 'emissiveNode', config.emissiveNode)
  assignIfDefined(material, 'metalnessNode', config.metalnessNode)
  assignIfDefined(material, 'roughnessNode', config.roughnessNode)
  assignIfDefined(material, 'flatShading', config.flatShading)
}

function applyCommonMaterialConfig(
  material: MeshBasicNodeMaterial | MeshStandardNodeMaterial,
  config: NodeMaterialConfig
) {
  assignIfDefined(material, 'colorNode', config.colorNode)
  assignIfDefined(material, 'opacityNode', config.opacityNode)
  assignIfDefined(material, 'normalNode', config.normalNode)
  assignIfDefined(material, 'positionNode', config.positionNode)
  assignIfDefined(material, 'transparent', config.transparent)
  assignIfDefined(material, 'side', config.side)
  assignIfDefined(material, 'blending', config.blending)
  assignIfDefined(material, 'depthTest', config.depthTest)
  assignIfDefined(material, 'depthWrite', config.depthWrite)
  assignIfDefined(material, 'wireframe', config.wireframe)
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
      material.value = new MeshBasicNodeMaterial()
      if (type === 'standard') {
        material.value = new MeshStandardNodeMaterial()
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
    applyCommonMaterialConfig(mat, newConfig)
    if (mat instanceof MeshStandardNodeMaterial) {
      applyStandardMaterialConfig(mat, newConfig)
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
    ...(config !== undefined && { config }),
  })
}

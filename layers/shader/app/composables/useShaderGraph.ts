// @ts-nocheck - TSL types are complex
import { mix as tslMix } from 'three/tsl'
import type { InjectionKey } from 'vue'
import type { TSLNode } from '../types'

export type BlendMode = 'normal' | 'add' | 'multiply' | 'screen' | 'overlay' | 'mix'

export interface ShaderGraphEntry {
  node: TSLNode
  order: number
  blend: BlendMode
  opacity: number
}

export interface ShaderGraph {
  register: (id: string, node: TSLNode, order?: number, blend?: BlendMode, opacity?: number) => void
  unregister: (id: string) => void
  update: (id: string, node: TSLNode) => void
  finalNode: ComputedRef<TSLNode | null>
  /** Increments on topology changes (add/remove) to signal material recompilation */
  version: Ref<number>
}

export const SHADER_GRAPH_KEY: InjectionKey<ShaderGraph> = Symbol('shader-graph')

/**
 * Creates a reactive shader graph that composes multiple TSL nodes via blend modes.
 * Only recomputes on topology changes (add/remove), NOT on uniform value changes.
 */
export function useShaderGraph(): ShaderGraph {
  const entries = reactive(new Map<string, ShaderGraphEntry>())
  const version = ref(0)

  function register(
    id: string,
    node: TSLNode,
    order = 0,
    blend: BlendMode = 'normal',
    opacity = 1.0
  ) {
    entries.set(id, { node, order, blend, opacity })
    version.value++
  }

  function unregister(id: string) {
    if (entries.delete(id)) {
      version.value++
    }
  }

  function update(id: string, node: TSLNode) {
    const entry = entries.get(id)
    if (entry) {
      entry.node = node
      version.value++
    }
  }

  const finalNode = computed<TSLNode | null>(() => {
    // Touch version to track topology changes
    void version.value

    const sorted = [...entries.values()].sort((a, b) => a.order - b.order)
    if (sorted.length === 0) return null

    let result = sorted[0].node

    for (let i = 1; i < sorted.length; i++) {
      const entry = sorted[i]
      result = applyBlend(result, entry.node, entry.blend, entry.opacity)
    }

    return result
  })

  const graph: ShaderGraph = {
    register,
    unregister,
    update,
    finalNode,
    version,
  }

  provide(SHADER_GRAPH_KEY, graph)

  return graph
}

/**
 * Inject the shader graph from a parent Material component.
 */
export function useShaderGraphContext(): ShaderGraph {
  const graph = inject(SHADER_GRAPH_KEY)
  if (!graph) {
    throw new Error('useShaderGraphContext() must be used inside a <ShaderMaterial> component')
  }
  return graph
}

function applyBlend(base: TSLNode, layer: TSLNode, mode: BlendMode, opacity: number): TSLNode {
  let blended: TSLNode

  switch (mode) {
    case 'add':
      blended = base.add(layer)
      break
    case 'multiply':
      blended = base.mul(layer)
      break
    case 'screen':
      blended = base.add(layer).sub(base.mul(layer))
      break
    case 'overlay': {
      // Simplified overlay: multiply dark, screen light
      const multiply = base.mul(layer).mul(2)
      const screen = base.add(layer).sub(base.mul(layer)).mul(2).sub(1)
      blended = tslMix(multiply, screen, base)
      break
    }
    case 'mix':
    case 'normal':
    default:
      blended = layer
      break
  }

  if (opacity < 1) {
    return tslMix(base, blended, opacity)
  }
  return blended
}

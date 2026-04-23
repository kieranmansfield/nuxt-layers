import type { InjectionKey, Ref, ShallowRef } from 'vue'
import type { TSLNode } from '../types'

export type ShaderStage = 'fragment' | 'vertex' | 'ray' | 'uv'

export interface ShaderStageEntry {
  fn: (input: TSLNode) => TSLNode
  order: number
  stage: ShaderStage
}

export interface ShaderPipelineContext {
  register: (fn: ShaderStageEntry['fn'], order?: number, stage?: ShaderStage) => void
  unregister: (fn: ShaderStageEntry['fn']) => void
  stagesFor: (stage: ShaderStage) => ShaderStageEntry[]
  /** Increments on topology changes (add/remove) to trigger material recompilation */
  version: Ref<number>
  /** Current UV node — starts as uv(), updated by UV transformer blocks before generators run.
   *  Generators read this via useShaderPipelineContext().uvNode to get the transformed UV. */
  uvNode: ShallowRef<TSLNode | null>
  /** Built ray direction node — populated by ShaderPipeline after ray transformers reduce.
   *  Terminal generators (SkyAtmosphere, RaymarchTunnel, etc.) read this in Phase 4. */
  rayNode: ShallowRef<TSLNode | null>
}

export const SHADER_PIPELINE_KEY: InjectionKey<ShaderPipelineContext> = Symbol('shader-pipeline')

/**
 * Creates a shader pipeline context and provides it to child components.
 * Call this inside <ShaderPipeline> — it provides the context that useShaderStage() injects.
 */
export function useShaderPipeline(): ShaderPipelineContext {
  const entries: ShaderStageEntry[] = []
  const version = ref(0)
  const uvNode = shallowRef<TSLNode | null>(null)
  const rayNode = shallowRef<TSLNode | null>(null)

  function register(fn: ShaderStageEntry['fn'], order = 0, stage: ShaderStage = 'fragment') {
    entries.push({ fn, order, stage })
    version.value++
  }

  function unregister(fn: ShaderStageEntry['fn']) {
    const i = entries.findIndex(e => e.fn === fn)
    if (i !== -1) {
      entries.splice(i, 1)
      version.value++
    }
  }

  function stagesFor(stage: ShaderStage): ShaderStageEntry[] {
    return entries.filter(e => e.stage === stage).sort((a, b) => a.order - b.order)
  }

  const context: ShaderPipelineContext = { register, unregister, stagesFor, version, uvNode, rayNode }
  provide(SHADER_PIPELINE_KEY, context)
  return context
}

/**
 * Registers a stage function into the nearest parent ShaderPipeline.
 * The function receives the current pipeline node and returns the transformed node.
 *
 * @param stageFn - Transform function: (input: TSLNode) => TSLNode
 * @param order   - Execution order within the stage (lower runs first)
 * @param stage   - 'fragment' (default), 'vertex', or 'ray'
 *
 * @example
 * // Inside a block component's <script setup>:
 * useShaderStage((_prev) => vec4(colorNode, 1.0), props.order ?? 0)
 *
 * // Vertex deformation:
 * useShaderStage((pos) => pos.add(normalNode.mul(offset)), 0, 'vertex')
 */
export function useShaderStage(
  stageFn: ShaderStageEntry['fn'],
  order = 0,
  stage: ShaderStage = 'fragment',
): void {
  const pipeline = inject(SHADER_PIPELINE_KEY)
  if (!pipeline) {
    throw new Error('useShaderStage() must be called inside a <ShaderPipeline> component')
  }
  onMounted(() => pipeline.register(stageFn, order, stage))
  onUnmounted(() => pipeline.unregister(stageFn))
}

/**
 * Injects the pipeline context from a parent ShaderPipeline.
 * Use this in advanced block components that need direct context access
 * (e.g. terminal ray generators that read pipeline.rayNode).
 */
export function useShaderPipelineContext(): ShaderPipelineContext {
  const pipeline = inject(SHADER_PIPELINE_KEY)
  if (!pipeline) {
    throw new Error('useShaderPipelineContext() must be called inside a <ShaderPipeline> component')
  }
  return pipeline
}

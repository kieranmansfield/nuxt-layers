/**
 * Material Factory
 * Creates Three.js TSL materials from shader layer functions
 */
import { BackSide, DoubleSide, FrontSide, type Side } from 'three'
import { vec4 } from 'three/tsl'
import { MeshBasicNodeMaterial } from 'three/webgpu'

import type { TSLNode } from './types'

import {
  aurora,
  createAuroraUniforms,
  updateAuroraUniforms,
  type AuroraOptions,
  type AuroraUniforms,
} from './layers/aurora'
import {
  createMeshGradientUniforms,
  meshGradient,
  updateMeshGradientUniforms,
  type MeshGradientOptions,
  type MeshGradientUniforms,
} from './layers/meshGradient'
import {
  createPaperShadingUniforms,
  paperShading,
  updatePaperShadingUniforms,
  type PaperShadingOptions,
  type PaperShadingUniforms,
} from './layers/paperShading'
import {
  createShaderGradientUniforms,
  shaderGradient,
  updateShaderGradientUniforms,
  type ShaderGradientOptions,
  type ShaderGradientUniforms,
} from './layers/shaderGradient'
// Import shader layers
import {
  createStripeGradientUniforms,
  stripeGradient,
  updateStripeGradientUniforms,
  type StripeGradientOptions,
  type StripeGradientUniforms,
} from './layers/stripe'


// ============================================
// Types
// ============================================

export type MaterialOptions = {
  /** Transparent material */
  transparent?: boolean
  /** Material side */
  side?: 'front' | 'back' | 'double'
  /** Opacity (0-1) */
  opacity?: number
  /** Depth test */
  depthTest?: boolean
  /** Depth write */
  depthWrite?: boolean
}

export type ShaderType = 'stripe' | 'meshGradient' | 'aurora' | 'shaderGradient' | 'paperShading'

export type ShaderOptions<T extends ShaderType> = T extends 'stripe'
  ? StripeGradientOptions
  : T extends 'meshGradient'
    ? MeshGradientOptions
    : T extends 'aurora'
      ? AuroraOptions
      : T extends 'shaderGradient'
        ? ShaderGradientOptions
        : T extends 'paperShading'
          ? PaperShadingOptions
          : never

export type ShaderUniforms<T extends ShaderType> = T extends 'stripe'
  ? StripeGradientUniforms
  : T extends 'meshGradient'
    ? MeshGradientUniforms
    : T extends 'aurora'
      ? AuroraUniforms
      : T extends 'shaderGradient'
        ? ShaderGradientUniforms
        : T extends 'paperShading'
          ? PaperShadingUniforms
          : never

export type ShaderMaterialResult<T extends ShaderType> = {
  material: MeshBasicNodeMaterial
  uniforms: ShaderUniforms<T>
  update: (options: Partial<ShaderOptions<T>>) => void
  dispose: () => void
}

// ============================================
// Side Mapping
// ============================================

const sideMap: Record<string, Side> = {
  front: FrontSide,
  back: BackSide,
  double: DoubleSide,
}

function createShaderUniforms<T extends ShaderType>(
  type: T,
  shaderOptions?: ShaderOptions<T>
): ShaderUniforms<T> {
  switch (type) {
    case 'stripe':
      return createStripeGradientUniforms(shaderOptions as StripeGradientOptions) as ShaderUniforms<T>
    case 'meshGradient':
      return createMeshGradientUniforms(shaderOptions as MeshGradientOptions) as ShaderUniforms<T>
    case 'aurora':
      return createAuroraUniforms(shaderOptions as AuroraOptions) as ShaderUniforms<T>
    case 'shaderGradient':
      return createShaderGradientUniforms(shaderOptions as ShaderGradientOptions) as ShaderUniforms<T>
    case 'paperShading':
      return createPaperShadingUniforms(shaderOptions as PaperShadingOptions) as ShaderUniforms<T>
  }
}

function createShaderColorNode<T extends ShaderType>(type: T, uniforms: ShaderUniforms<T>): TSLNode {
  switch (type) {
    case 'stripe':
      return stripeGradient(uniforms as StripeGradientUniforms)
    case 'meshGradient':
      return meshGradient(uniforms as MeshGradientUniforms)
    case 'aurora':
      return aurora(uniforms as AuroraUniforms)
    case 'shaderGradient':
      return shaderGradient(uniforms as ShaderGradientUniforms)
    case 'paperShading':
      return paperShading(uniforms as PaperShadingUniforms)
  }
}

function updateShaderUniforms<T extends ShaderType>(
  type: T,
  uniforms: ShaderUniforms<T>,
  options: Partial<ShaderOptions<T>>
): void {
  switch (type) {
    case 'stripe':
      updateStripeGradientUniforms(
        uniforms as StripeGradientUniforms,
        options as Partial<StripeGradientOptions>
      )
      return
    case 'meshGradient':
      updateMeshGradientUniforms(
        uniforms as MeshGradientUniforms,
        options as Partial<MeshGradientOptions>
      )
      return
    case 'aurora':
      updateAuroraUniforms(uniforms as AuroraUniforms, options as Partial<AuroraOptions>)
      return
    case 'shaderGradient':
      updateShaderGradientUniforms(
        uniforms as ShaderGradientUniforms,
        options as Partial<ShaderGradientOptions>
      )
      return
    case 'paperShading':
      updatePaperShadingUniforms(
        uniforms as PaperShadingUniforms,
        options as Partial<PaperShadingOptions>
      )
  }
}

function applyMaterialOptions(
  material: MeshBasicNodeMaterial,
  colorNode: TSLNode,
  options?: MaterialOptions
): void {
  const {
    transparent = false,
    side = 'double',
    opacity = 1,
    depthTest = true,
    depthWrite = true,
  } = options || {}

  material.transparent = transparent
  material.side = sideMap[side] || DoubleSide
  material.depthTest = depthTest
  material.depthWrite = depthWrite
  material.colorNode = transparent ? vec4(colorNode, opacity) : colorNode
}

// ============================================
// Factory Functions
// ============================================

/**
 * Create a shader material from a shader type
 */
export function createShaderMaterial<T extends ShaderType>(
  type: T,
  shaderOptions?: ShaderOptions<T>,
  materialOptions?: MaterialOptions
): ShaderMaterialResult<T> {
  const uniforms = createShaderUniforms(type, shaderOptions)
  const colorNode = createShaderColorNode(type, uniforms)

  // Create material
  const material = new MeshBasicNodeMaterial()
  applyMaterialOptions(material, colorNode, materialOptions)

  // Update function
  const update = (options: Partial<ShaderOptions<T>>) => {
    updateShaderUniforms(type, uniforms, options)
  }

  // Dispose function
  const dispose = () => {
    material.dispose()
  }

  return {
    material,
    uniforms,
    update,
    dispose,
  }
}

// ============================================
// Convenience Factory Functions
// ============================================

/**
 * Create a stripe gradient material
 */
export function createStripeMaterial(
  options?: StripeGradientOptions,
  materialOptions?: MaterialOptions
): ShaderMaterialResult<'stripe'> {
  return createShaderMaterial('stripe', options, materialOptions)
}

/**
 * Create a mesh gradient material
 */
export function createMeshGradientMaterial(
  options?: MeshGradientOptions,
  materialOptions?: MaterialOptions
): ShaderMaterialResult<'meshGradient'> {
  return createShaderMaterial('meshGradient', options, materialOptions)
}

/**
 * Create an aurora material
 */
export function createAuroraMaterial(
  options?: AuroraOptions,
  materialOptions?: MaterialOptions
): ShaderMaterialResult<'aurora'> {
  return createShaderMaterial('aurora', options, materialOptions)
}

/**
 * Create a shader gradient material
 */
export function createShaderGradientMaterial(
  options?: ShaderGradientOptions,
  materialOptions?: MaterialOptions
): ShaderMaterialResult<'shaderGradient'> {
  return createShaderMaterial('shaderGradient', options, materialOptions)
}

/**
 * Create a paper shading material
 */
export function createPaperShadingMaterial(
  options?: PaperShadingOptions,
  materialOptions?: MaterialOptions
): ShaderMaterialResult<'paperShading'> {
  return createShaderMaterial('paperShading', options, materialOptions)
}

// ============================================
// Composable Hook
// ============================================

/**
 * Vue composable for creating reactive shader materials
 */
export function useShaderMaterial<T extends ShaderType>(
  type: T,
  shaderOptions?: MaybeRef<ShaderOptions<T>>,
  materialOptions?: MaterialOptions
) {
  const result = shallowRef<ShaderMaterialResult<T> | null>(null)

  const initOptions = unref(shaderOptions)
  result.value = createShaderMaterial(type, initOptions, materialOptions)

  // Watch for option changes
  if (isRef(shaderOptions)) {
    watch(
      shaderOptions,
      (newOptions) => {
        if (result.value && newOptions) {
          result.value.update(newOptions as Partial<ShaderOptions<T>>)
        }
      },
      { deep: true }
    )
  }

  // Auto dispose on unmount
  onUnmounted(() => {
    result.value?.dispose()
  })

  return {
    material: computed(() => result.value?.material),
    uniforms: computed(() => result.value?.uniforms),
    update: (options: Partial<ShaderOptions<T>>) => result.value?.update(options),
    dispose: () => result.value?.dispose(),
  }
}

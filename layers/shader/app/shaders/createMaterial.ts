// @ts-nocheck - TSL types are complex and not fully exported from three/tsl
/**
 * Material Factory
 * Creates Three.js TSL materials from shader layer functions
 */
import { BackSide, DoubleSide, FrontSide, type Side } from 'three'
import { vec4 } from 'three/tsl'
import { MeshBasicNodeMaterial } from 'three/webgpu'
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

type TSLNode = ShaderNodeObject<Node>

// ============================================
// Types
// ============================================

export interface MaterialOptions {
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

export interface ShaderMaterialResult<T extends ShaderType> {
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
  const {
    transparent = false,
    side = 'double',
    opacity = 1,
    depthTest = true,
    depthWrite = true,
  } = materialOptions || {}

  let uniforms: ShaderUniforms<T>
  let colorNode: TSLNode

  // Create uniforms and color node based on type
  switch (type) {
    case 'stripe':
      uniforms = createStripeGradientUniforms(
        shaderOptions as StripeGradientOptions
      ) as ShaderUniforms<T>
      colorNode = stripeGradient(uniforms as StripeGradientUniforms)
      break
    case 'meshGradient':
      uniforms = createMeshGradientUniforms(
        shaderOptions as MeshGradientOptions
      ) as ShaderUniforms<T>
      colorNode = meshGradient(uniforms as MeshGradientUniforms)
      break
    case 'aurora':
      uniforms = createAuroraUniforms(shaderOptions as AuroraOptions) as ShaderUniforms<T>
      colorNode = aurora(uniforms as AuroraUniforms)
      break
    case 'shaderGradient':
      uniforms = createShaderGradientUniforms(
        shaderOptions as ShaderGradientOptions
      ) as ShaderUniforms<T>
      colorNode = shaderGradient(uniforms as ShaderGradientUniforms)
      break
    case 'paperShading':
      uniforms = createPaperShadingUniforms(
        shaderOptions as PaperShadingOptions
      ) as ShaderUniforms<T>
      colorNode = paperShading(uniforms as PaperShadingUniforms)
      break
    default:
      throw new Error(`Unknown shader type: ${type}`)
  }

  // Create material
  const material = new MeshBasicNodeMaterial()
  material.colorNode = transparent ? vec4(colorNode, opacity) : colorNode
  material.transparent = transparent
  material.side = sideMap[side] || DoubleSide
  material.depthTest = depthTest
  material.depthWrite = depthWrite

  // Update function
  const update = (options: Partial<ShaderOptions<T>>) => {
    switch (type) {
      case 'stripe':
        updateStripeGradientUniforms(
          uniforms as StripeGradientUniforms,
          options as Partial<StripeGradientOptions>
        )
        break
      case 'meshGradient':
        updateMeshGradientUniforms(
          uniforms as MeshGradientUniforms,
          options as Partial<MeshGradientOptions>
        )
        break
      case 'aurora':
        updateAuroraUniforms(uniforms as AuroraUniforms, options as Partial<AuroraOptions>)
        break
      case 'shaderGradient':
        updateShaderGradientUniforms(
          uniforms as ShaderGradientUniforms,
          options as Partial<ShaderGradientOptions>
        )
        break
      case 'paperShading':
        updatePaperShadingUniforms(
          uniforms as PaperShadingUniforms,
          options as Partial<PaperShadingOptions>
        )
        break
    }
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

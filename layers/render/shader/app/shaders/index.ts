/**
 * Modular TSL Shader System
 *
 * A composable shader system built on Three.js TSL (Texture Shader Language)
 * for creating reactive, high-performance shader effects.
 *
 * @example
 * ```ts
 * // Using the material factory
 * import { createStripeMaterial } from '#layers/shader/app/shaders'
 *
 * const { material, update, dispose } = createStripeMaterial({
 *   colors: ['#ff0000', '#00ff00', '#0000ff'],
 *   speed: 0.5,
 * })
 *
 * // Update colors reactively
 * update({ colors: ['#ffff00', '#ff00ff', '#00ffff'] })
 * ```
 *
 * @example
 * ```ts
 * // Using individual utilities
 * import { simplexNoise2D, blob, rainbow } from '#layers/shader/app/shaders'
 * import { uv, mix } from 'three/tsl'
 *
 * const noise = simplexNoise2D(uv().mul(5))
 * const shape = blob(uv(), [0.5, 0.5], 0.3)
 * const color = rainbow(noise)
 * ```
 */

// ============================================
// Types
// ============================================

export type { TSLNode } from './types'

// ============================================
// Common Utilities
// ============================================

// Noise functions
export {
  // Hash functions
  hash21,
  hash22,
  hash33,
  // 2D noise
  valueNoise2D,
  simplexNoise2D,
  // 3D noise
  gradientNoise3D,
  // FBM
  fbm2D,
  fbm3D,
  // Voronoi
  voronoi2D,
  // Domain warping
  domainWarp2D,
  // Turbulence
  turbulence2D,
  // Types
  type FBMOptions,
  type VoronoiResult,
} from './common/noise'

// Shape functions
export {
  // Basic shapes
  blob,
  circle,
  ring,
  radialGradient,
  roundedRect,
  rect,
  // Lines & stripes
  horizontalLine,
  verticalLine,
  stripes,
  smoothStripes,
  // Grids & patterns
  grid,
  dots,
  checker,
  // Polar patterns
  star,
  radialLines,
  concentricCircles,
  polygon,
} from './common/shapes'

// Blend modes
export {
  // Basic blending
  blendLinear,
  blendAdd,
  blendSubtract,
  // Photoshop-style
  blendMultiply,
  blendScreen,
  blendOverlay,
  blendSoftLight,
  blendHardLight,
  blendDifference,
  blendExclusion,
  blendDarken,
  blendLighten,
  blendColorDodge,
  blendColorBurn,
  blendLinearDodge,
  blendLinearBurn,
  blendVividLight,
  blendPinLight,
  // Advanced
  blendWithOpacity,
  blendLayers,
  // Color utilities
  luminance,
  desaturate,
  saturate,
  brightness,
  contrast,
  invert,
} from './common/blend'

// Palette & color
export {
  // Gradients
  gradient2,
  gradient3,
  gradient4,
  gradientMulti,
  // Cosine palette
  cosinePalette,
  // Preset palettes
  rainbow,
  sunset,
  ocean,
  fire,
  ice,
  neon,
  pastel,
  grayscale,
  // Color manipulation
  hueShift,
  temperature,
  vibrance,
  // Utilities
  hexToVec3,
  hslToRgb,
  quantize,
  // Types
  type ColorStop,
} from './common/palette'

// Grain & film effects
export {
  // Basic grain
  grain,
  animatedGrain,
  coloredGrain,
  // Dithering
  bayer2x2,
  bayer4x4,
  ditherColor,
  // Scanlines
  scanlines,
  interlace,
  // Vignette
  vignette,
  rectVignette,
  // Paper/texture
  paperTexture,
  halftone,
  // Apply effects
  applyGrain,
  applyColoredGrain,
  applyVignette,
  applyScanlines,
  crtEffect,
} from './common/grain'

// UV manipulation
export {
  // Basic transformations
  scaleUV,
  rotateUV,
  translateUV,
  tileUV,
  mirrorUV,
  // Coordinate conversion
  toPolar,
  fromPolar,
  // Distortions
  waveUV,
  rippleUV,
  swirlUV,
  barrelUV,
  pincushionUV,
  kaleidoscopeUV,
  zoomUV,
  // Aspect ratio
  aspectCorrect,
  coverUV,
  containUV,
  // Animation
  scrollUV,
  parallaxUV,
} from './common/uv'

// ============================================
// Shader Layers
// ============================================

// Stripe gradient
export {
  createStripeGradientUniforms,
  stripeGradient,
  updateStripeGradientUniforms,
  type StripeGradientOptions,
  type StripeGradientUniforms,
} from './layers/stripe'

// Mesh gradient
export {
  createMeshGradientUniforms,
  meshGradient,
  updateMeshGradientUniforms,
  type MeshGradientOptions,
  type MeshGradientUniforms,
} from './layers/meshGradient'

// Aurora
export {
  createAuroraUniforms,
  aurora,
  updateAuroraUniforms,
  type AuroraOptions,
  type AuroraUniforms,
} from './layers/aurora'

// Shader gradient
export {
  createShaderGradientUniforms,
  shaderGradient,
  updateShaderGradientUniforms,
  type ShaderGradientOptions,
  type ShaderGradientUniforms,
} from './layers/shaderGradient'

// Paper shading
export {
  createPaperShadingUniforms,
  paperShading,
  updatePaperShadingUniforms,
  type PaperShadingOptions,
  type PaperShadingUniforms,
} from './layers/paperShading'

// ============================================
// Material Factory
// ============================================

export {
  // Main factory
  createShaderMaterial,
  // Convenience factories
  createStripeMaterial,
  createMeshGradientMaterial,
  createAuroraMaterial,
  createShaderGradientMaterial,
  createPaperShadingMaterial,
  // Vue composable
  useShaderMaterial,
  // Types
  type MaterialOptions,
  type ShaderType,
  type ShaderOptions,
  type ShaderUniforms,
  type ShaderMaterialResult,
} from './createMaterial'

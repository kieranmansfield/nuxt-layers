export type RendererBackend = 'webgpu' | 'webgl'
export type QualityLevel = 'low' | 'medium' | 'high' | 'ultra'
export type ToneMappingPreset = 'aces' | 'reinhard' | 'cineon' | 'linear'

export type RendererCapabilities = {
  backend: RendererBackend
  maxTextureSize: number
  maxTextures: number
  maxVertexUniforms: number
  maxFragmentUniforms: number
  floatTextures: boolean
  anisotropy: number
  precision: 'lowp' | 'mediump' | 'highp'
  devicePixelRatio: number
  isWebGPU: boolean
}

export type QualitySettings = {
  pixelRatio: number
  antialias: boolean
  shadows: boolean
  postProcessing: boolean
  particleCount: number
}

export const QUALITY_PRESETS: Record<QualityLevel, QualitySettings> = {
  low: {
    pixelRatio: 1,
    antialias: false,
    shadows: false,
    postProcessing: false,
    particleCount: 500,
  },
  medium: {
    pixelRatio: 1.5,
    antialias: true,
    shadows: false,
    postProcessing: true,
    particleCount: 2500,
  },
  high: {
    pixelRatio: 2,
    antialias: true,
    shadows: true,
    postProcessing: true,
    particleCount: 10000,
  },
  ultra: {
    pixelRatio: 2,
    antialias: true,
    shadows: true,
    postProcessing: true,
    particleCount: 50000,
  },
}

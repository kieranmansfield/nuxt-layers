export type RendererBackend = 'webgpu' | 'webgl'
export type QualityLevel = 'low' | 'medium' | 'high' | 'ultra'
export type ToneMappingPreset = 'aces' | 'reinhard' | 'cineon' | 'linear'

export interface RendererCapabilities {
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

export interface QualitySettings {
  pixelRatio: number
  antialias: boolean
  shadows: boolean
  postProcessing: boolean
}

export const QUALITY_PRESETS: Record<QualityLevel, QualitySettings> = {
  low: {
    pixelRatio: 1,
    antialias: false,
    shadows: false,
    postProcessing: false,
  },
  medium: {
    pixelRatio: 1.5,
    antialias: true,
    shadows: false,
    postProcessing: true,
  },
  high: {
    pixelRatio: 2,
    antialias: true,
    shadows: true,
    postProcessing: true,
  },
  ultra: {
    pixelRatio: 2,
    antialias: true,
    shadows: true,
    postProcessing: true,
  },
}

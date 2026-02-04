import type { WebGLRenderer } from 'three'
import type { QualityLevel, QualitySettings, RendererBackend, RendererCapabilities } from '../types'
import { QUALITY_PRESETS } from '../types'

/**
 * Detect and expose renderer capabilities
 */
export function useRendererCapabilities() {
  const capabilities = ref<RendererCapabilities | null>(null)
  const isReady = ref(false)

  function detectFromRenderer(renderer: WebGLRenderer) {
    const glCaps = renderer.capabilities

    // Check if WebGPU
    const isWebGPU = 'gpu' in navigator && renderer.constructor.name === 'WebGPURenderer'

    capabilities.value = {
      backend: (isWebGPU ? 'webgpu' : 'webgl') as RendererBackend,
      maxTextureSize: glCaps.maxTextureSize,
      maxTextures: glCaps.maxTextures,
      maxVertexUniforms: glCaps.maxVertexUniforms,
      maxFragmentUniforms: glCaps.maxFragmentUniforms,
      floatTextures: glCaps.isWebGL2 || false,
      anisotropy: renderer.capabilities.getMaxAnisotropy(),
      precision: glCaps.precision as 'lowp' | 'mediump' | 'highp',
      devicePixelRatio: renderer.getPixelRatio(),
      isWebGPU,
    }

    isReady.value = true
  }

  const isWebGPU = computed(() => capabilities.value?.isWebGPU ?? false)
  const backend = computed(() => capabilities.value?.backend ?? 'webgl')
  const maxTextureSize = computed(() => capabilities.value?.maxTextureSize ?? 0)

  return {
    capabilities: readonly(capabilities),
    isReady: readonly(isReady),
    isWebGPU,
    backend,
    maxTextureSize,
    detectFromRenderer,
  }
}

/**
 * Check browser WebGPU support
 */
export async function checkWebGPUSupport(): Promise<boolean> {
  if (!('gpu' in navigator)) {
    return false
  }

  try {
    const adapter = await (navigator as any).gpu.requestAdapter()
    return adapter !== null
  } catch {
    return false
  }
}

/**
 * Get quality settings for a given level
 */
export function getQualitySettings(level: QualityLevel): QualitySettings {
  return QUALITY_PRESETS[level]
}

/**
 * Auto-detect optimal quality based on device
 */
export function useAutoQuality() {
  const quality = ref<QualityLevel>('high')
  const settings = computed(() => QUALITY_PRESETS[quality.value])

  onMounted(() => {
    // Check device pixel ratio
    const dpr = window.devicePixelRatio || 1

    // Check if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )

    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 2

    // Determine quality
    if (isMobile || cores <= 2) {
      quality.value = 'low'
    } else if (dpr <= 1 || cores <= 4) {
      quality.value = 'medium'
    } else if (dpr <= 2) {
      quality.value = 'high'
    } else {
      quality.value = 'ultra'
    }
  })

  function setQuality(level: QualityLevel) {
    quality.value = level
  }

  return {
    quality: readonly(quality),
    settings,
    setQuality,
  }
}

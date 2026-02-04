/* eslint-disable no-console */
import { checkWebGPUSupport } from '../composables/useRendererCapabilities'

export default defineNuxtPlugin(async () => {
  const config = useAppConfig()
  const shaderConfig = (config.shader || {}) as {
    preferWebGPU?: boolean
  }

  // Check WebGPU support
  const hasWebGPU = await checkWebGPUSupport()
  const useWebGPU = shaderConfig.preferWebGPU && hasWebGPU

  // Log renderer info in development
  if (import.meta.dev) {
    console.log('[Shader Layer] Initialized')
    console.log(`[Shader Layer] WebGPU supported: ${hasWebGPU}`)
    console.log(`[Shader Layer] Using: ${useWebGPU ? 'WebGPU' : 'WebGL'}`)
  }

  return {
    provide: {
      shader: {
        hasWebGPU,
        useWebGPU,
        config: shaderConfig,
      },
    },
  }
})

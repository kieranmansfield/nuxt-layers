// @ts-nocheck - TSL types are complex
import { Color } from 'three'
import { uniform } from 'three/tsl'
import type { InjectionKey } from 'vue'
import type { ShaderTimeOptions } from './useShaderTime'
import type { MousePositionOptions } from './useMousePosition'

export interface ShaderRuntimeOptions {
  speed?: number
  accentColor?: string
  darkMode?: boolean
  mouseSmoothing?: number
  autoStart?: boolean
}

export interface ShaderRuntime {
  // Sub-systems
  time: ReturnType<typeof useShaderTime>
  mouse: ReturnType<typeof useMousePosition>

  // Global uniform nodes
  transitionProgress: ReturnType<typeof uniform>
  accentColorNode: ReturnType<typeof uniform>
  darkModeNode: ReturnType<typeof uniform>

  // JS-side state
  accentColor: Ref<string>
  darkMode: Ref<boolean>
}

export const SHADER_RUNTIME_KEY: InjectionKey<ShaderRuntime> = Symbol('shader-runtime')

/**
 * Creates the global shader runtime, composing time, mouse, and global uniforms.
 * Should be called once in a Runtime component and provided to descendants.
 */
export function useShaderRuntime(options: ShaderRuntimeOptions = {}): ShaderRuntime {
  const {
    speed = 1.0,
    accentColor: initialAccent = '#8b5cf6',
    darkMode: initialDarkMode = true,
    mouseSmoothing = 0.1,
    autoStart = true,
  } = options

  // Compose sub-systems
  const time = useShaderTime({ speed, autoStart })
  const mouse = useMousePosition({ smoothing: mouseSmoothing })

  // Global uniforms -- created once, mutated via .value
  const accentColorValue = new Color(initialAccent)
  const transitionProgress = uniform(0)
  const accentColorNode = uniform(accentColorValue)
  const darkModeNode = uniform(initialDarkMode ? 1.0 : 0.0)

  // Reactive JS state
  const accentColor = ref(initialAccent)
  const darkMode = ref(initialDarkMode)

  // Sync reactive state to uniforms
  watch(accentColor, (hex) => {
    accentColorValue.set(hex)
    accentColorNode.value = accentColorValue
  })

  watch(darkMode, (val) => {
    darkModeNode.value = val ? 1.0 : 0.0
  })

  const runtime: ShaderRuntime = {
    time,
    mouse,
    transitionProgress,
    accentColorNode,
    darkModeNode,
    accentColor,
    darkMode,
  }

  // Provide for descendant injection
  provide(SHADER_RUNTIME_KEY, runtime)

  return runtime
}

/**
 * Inject the shader runtime from an ancestor Runtime component.
 * Throws if no runtime is provided.
 */
export function useShaderRuntimeContext(): ShaderRuntime {
  const runtime = inject(SHADER_RUNTIME_KEY)
  if (!runtime) {
    throw new Error('useShaderRuntimeContext() must be used inside a <ShaderRuntime> component')
  }
  return runtime
}

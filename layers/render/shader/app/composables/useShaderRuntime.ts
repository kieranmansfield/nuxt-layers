import type { InjectionKey } from 'vue'
import { Color } from 'three'
import { uniform } from 'three/tsl'

import type { AmbientUniforms } from './useAmbientMaterials'

export type ShaderRuntimeOptions = {
  speed?: number
  accentColor?: string
  darkMode?: boolean
  mouseSmoothing?: number
  autoStart?: boolean
}

export type ShaderRuntime = {
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

/** Feeds the enclosing runtime's mouse into these uniforms. Outside a runtime they keep their value. */
export function useRuntimeMouse(uniforms: {
  mouseX: { value: number }
  mouseY: { value: number }
}) {
  try {
    const { mouse } = useShaderRuntimeContext()
    watch(
      () => [mouse.mouseX.value, mouse.mouseY.value],
      ([mx, my]) => {
        uniforms.mouseX.value = mx ?? 0.5
        uniforms.mouseY.value = my ?? 0.5
      },
      { immediate: true }
    )
  } catch {
    // No runtime: mouse can be set externally
  }
}

/** Wires an ambient preset's uniforms to its props and the runtime's mouse. */
export function useAmbientControls(
  uniforms: AmbientUniforms,
  props: { speed: () => number; intensity: () => number; mouseInteraction: () => boolean },
  mouseStrength: number
) {
  useRuntimeMouse(uniforms)
  watchUniformProp(props.speed, uniforms.speed)
  watchUniformProp(props.intensity, uniforms.intensity)
  watchUniformProp(props.mouseInteraction, uniforms.mouseStrength, (on) => (on ? mouseStrength : 0))
}

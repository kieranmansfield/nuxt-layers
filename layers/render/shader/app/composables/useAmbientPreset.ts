import {
  createAmbientUniforms,
  type AmbientUniforms,
} from '#layers/shader/app/composables/useAmbientMaterials'
import type { TSLNode } from '#layers/shader/app/types/tsl'

export type AmbientPresetProps = {
  speed?: number
  intensity?: number
  mouseInteraction?: boolean
}

/** Shared `withDefaults` for every non-theme ambient preset component. */
export const AMBIENT_PRESET_DEFAULTS = {
  speed: 1.0,
  intensity: 1.0,
  mouseInteraction: true,
}

/**
 * Builds an ambient preset's uniforms + TSL colour node once, then keeps the uniforms in sync
 * with the props. `mouseStrength` is what re-enabling mouseInteraction restores.
 */
export function useAmbientPreset(
  colorNodeFactory: (uniforms: AmbientUniforms) => TSLNode,
  props: Readonly<Required<AmbientPresetProps>>,
  mouseStrength: number
) {
  const uniforms = createAmbientUniforms({
    speed: props.speed,
    intensity: props.intensity,
    mouseInteraction: props.mouseInteraction,
  })

  // Built once; references the uniforms by pointer
  const colorNode = colorNodeFactory(uniforms)

  useAmbientControls(
    uniforms,
    {
      speed: () => props.speed,
      intensity: () => props.intensity,
      mouseInteraction: () => props.mouseInteraction,
    },
    mouseStrength
  )

  return { uniforms, colorNode }
}

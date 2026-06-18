import {
  createAmbientUniforms,
  type AmbientUniforms,
  type ThemeColorUniforms,
} from '#layers/shader/app/composables/useAmbientMaterials'
import type { TSLNode } from '#layers/shader/app/types/tsl'

export type ThemePresetProps = {
  speed?: number
  intensity?: number
  mouseInteraction?: boolean
  mouseStrength?: number
  color1?: string
  color2?: string
  color3?: string
  color4?: string
}

export function useThemePreset(
  colorNodeFactory: (uniforms: AmbientUniforms, colors: ThemeColorUniforms) => TSLNode,
  props: Readonly<Required<ThemePresetProps>>
) {
  const uniforms = createAmbientUniforms({
    speed: props.speed,
    intensity: props.intensity,
    mouseInteraction: props.mouseInteraction,
  })
  if (props.mouseInteraction) {
    uniforms.mouseStrength.value = props.mouseStrength
  }

  const c1 = useShaderColor(props.color1)
  const c2 = useShaderColor(props.color2)
  const c3 = useShaderColor(props.color3)
  const c4 = useShaderColor(props.color4)

  const colorNode = colorNodeFactory(uniforms, {
    color1: c1.node,
    color2: c2.node,
    color3: c3.node,
    color4: c4.node,
  })

  watch(
    () => props.color1,
    (hex) => c1.tweenTo(hex, 0.8)
  )
  watch(
    () => props.color2,
    (hex) => c2.tweenTo(hex, 0.8)
  )
  watch(
    () => props.color3,
    (hex) => c3.tweenTo(hex, 0.8)
  )
  watch(
    () => props.color4,
    (hex) => c4.tweenTo(hex, 0.8)
  )

  try {
    const runtime = useShaderRuntimeContext()
    watch(
      () => [runtime.mouse.mouseX.value, runtime.mouse.mouseY.value],
      ([mx, my]) => {
        uniforms.mouseX.value = mx ?? 0.5
        uniforms.mouseY.value = my ?? 0.5
      },
      { immediate: true }
    )
  } catch {
    // No runtime context
  }

  watch(
    () => props.speed,
    (v) => {
      uniforms.speed.value = v
    }
  )
  watch(
    () => props.intensity,
    (v) => {
      uniforms.intensity.value = v
    }
  )
  watch(
    () => props.mouseInteraction,
    (v) => {
      uniforms.mouseStrength.value = v ? props.mouseStrength : 0
    }
  )
  watch(
    () => props.mouseStrength,
    (v) => {
      if (props.mouseInteraction) uniforms.mouseStrength.value = v
    }
  )

  return { uniforms, colorNode }
}

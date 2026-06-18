import { Color, Vector3 } from 'three'
import { uniform } from 'three/tsl'
import { watch } from 'vue'

import { createAmbientUniforms, type AmbientUniforms, type ThemeColorUniforms } from '#layers/shader/app/composables/useAmbientMaterials'

export type ThemeNodeUniformProps = {
  speed: number | undefined
  intensity: number | undefined
  color1: string | undefined
  color2: string | undefined
  color3: string | undefined
  color4: string | undefined
}

function createColorUniform(hex?: string) {
  const color = new Color(hex ?? '#ffffff')
  return uniform(new Vector3(color.r, color.g, color.b))
}

function syncColorUniform(target: ThemeColorUniforms[keyof ThemeColorUniforms], hex?: string) {
  const color = new Color(hex ?? '#ffffff')
  target.value.set(color.r, color.g, color.b)
}

export function useThemeNodeUniforms(props: ThemeNodeUniformProps) {
  const colorUniforms: ThemeColorUniforms = {
    color1: createColorUniform(props.color1),
    color2: createColorUniform(props.color2),
    color3: createColorUniform(props.color3),
    color4: createColorUniform(props.color4),
  }

  const ambientUniforms: AmbientUniforms = createAmbientUniforms({
    speed: props.speed ?? 1,
    intensity: props.intensity ?? 1,
    mouseInteraction: false,
  })

  watch(
    () => props.color1,
    (value) => {
      syncColorUniform(colorUniforms.color1, value)
    }
  )
  watch(
    () => props.color2,
    (value) => {
      syncColorUniform(colorUniforms.color2, value)
    }
  )
  watch(
    () => props.color3,
    (value) => {
      syncColorUniform(colorUniforms.color3, value)
    }
  )
  watch(
    () => props.color4,
    (value) => {
      syncColorUniform(colorUniforms.color4, value)
    }
  )
  watch(
    () => props.speed,
    (value) => {
      ambientUniforms.speed.value = value ?? 1
    }
  )
  watch(
    () => props.intensity,
    (value) => {
      ambientUniforms.intensity.value = value ?? 1
    }
  )

  return {
    colorUniforms,
    ambientUniforms,
  }
}

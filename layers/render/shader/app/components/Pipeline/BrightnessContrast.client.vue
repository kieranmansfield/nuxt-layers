<script setup lang="ts">
  import { uniform, vec4 } from 'three/tsl'

  import {
    brightness as brightnessEffect,
    contrast as contrastEffect,
  } from '../../shaders/common/blend'

  const {
    brightness: brightnessProp = 0,
    contrast: contrastProp = 1,
    order = 0,
  } = defineProps<{
    /** Additive brightness offset: 0 = unchanged, positive = brighter */
    brightness?: number
    /** Contrast multiplier: 1 = unchanged, >1 = more contrast */
    contrast?: number
    order?: number
  }>()

  const brightnessNode = uniform(brightnessProp)
  const contrastNode = uniform(contrastProp)
  watch(
    () => brightnessProp,
    (v) => {
      brightnessNode.value = v
    }
  )
  watch(
    () => contrastProp,
    (v) => {
      contrastNode.value = v
    }
  )

  useShaderStage(
    (prev) =>
      vec4(brightnessEffect(contrastEffect(prev.xyz, contrastNode), brightnessNode), prev.w),
    order
  )
</script>

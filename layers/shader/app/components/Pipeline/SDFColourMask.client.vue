<!-- eslint-disable vue/no-boolean-default -->
<!-- eslint-disable vue/define-props-destructuring -->
<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
  // @ts-nocheck
  import { clamp, float, uniform, vec4 } from 'three/tsl'

  /**
   * Multiplies RGB by prev.r (treating the previous stage as a grayscale scalar mask).
   * Use after a scalar generator (RingField, ChebyshevNoiseField) and before CosinePalette
   * to apply the `col.mul(t)` phobon pattern.
   *
   * Pipeline: RingField (order 0) → SDFColourMask (order 1) → CosinePalette (order 2, scalarSource: 'prev')
   */
  const props = withDefaults(
    defineProps<{
      /** Raise the mask to a power before applying — values > 1 increase contrast */
      power?: number
      /** Clamp the mask to [0, 1] before multiplying */
      clampMask?: boolean
      order?: number
    }>(),
    { power: 1, clampMask: true, order: 0 }
  )

  const powerNode = uniform(props.power)
  watch(
    () => props.power,
    (v) => {
      powerNode.value = v
    }
  )

  useShaderStage((prev) => {
    let mask = prev.x.pow(powerNode)
    if (props.clampMask) mask = clamp(mask, float(0), float(1))
    return vec4(prev.xyz.mul(mask), prev.w)
  }, props.order)
</script>

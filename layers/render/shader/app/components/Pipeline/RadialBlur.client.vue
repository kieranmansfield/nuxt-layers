<script setup lang="ts">
  import { int, uniform, vec2 } from 'three/tsl'
  import { radialBlur } from 'three/addons/tsl/display/radialBlur.js'

  const {
    centerX = 0.5,
    centerY = 0.5,
    weight = 0.9,
    decay = 0.95,
    exposure = 5,
    count = 32,
    order = 0,
  } = defineProps<{
    centerX?: number
    centerY?: number
    /** Base weight of each sample (0-1) */
    weight?: number
    /** Per-sample weight decay (0-1) */
    decay?: number
    exposure?: number
    /** Samples along each ray (16-64) */
    count?: number
    order?: number
  }>()

  const centerNode = uniform(vec2(centerX, centerY))
  const weightNode = uniform(weight)
  const decayNode = uniform(decay)
  const exposureNode = uniform(exposure)
  watch([() => centerX, () => centerY], ([x, y]) => {
    centerNode.value.set(x, y)
  })
  watch(
    () => weight,
    (v) => {
      weightNode.value = v
    }
  )
  watch(
    () => decay,
    (v) => {
      decayNode.value = v
    }
  )
  watch(
    () => exposure,
    (v) => {
      exposureNode.value = v
    }
  )

  useShaderStage(
    (prev) =>
      radialBlur(prev, {
        center: centerNode,
        weight: weightNode,
        decay: decayNode,
        exposure: exposureNode,
        count: int(count),
      }),
    order
  )
</script>

<script setup lang="ts">
  import { float, floor, uniform, vec4 } from 'three/tsl'

  const { steps = 6, order = 0 } = defineProps<{
    /** Number of colour steps per channel */
    steps?: number
    order?: number
  }>()

  const stepsNode = uniform(steps)
  watch(
    () => steps,
    (v) => {
      stepsNode.value = v
    }
  )

  useShaderStage((prev) => {
    const posterised = floor(prev.xyz.mul(stepsNode)).div(stepsNode.sub(float(1)))
    return vec4(posterised, prev.w)
  }, order)
</script>

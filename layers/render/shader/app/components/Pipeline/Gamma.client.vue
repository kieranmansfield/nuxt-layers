<script setup lang="ts">
  import { float, pow, uniform, vec4 } from 'three/tsl'

  const { gamma = 2.2, order = 0 } = defineProps<{
    /** Gamma value: 1 = unchanged, 2.2 = standard display gamma */
    gamma?: number
    order?: number
  }>()

  const gammaNode = uniform(gamma)
  watch(
    () => gamma,
    (v) => {
      gammaNode.value = v
    }
  )

  useShaderStage((prev) => {
    const corrected = pow(prev.xyz.max(float(0)), float(1).div(gammaNode))
    return vec4(corrected, prev.w)
  }, order)
</script>

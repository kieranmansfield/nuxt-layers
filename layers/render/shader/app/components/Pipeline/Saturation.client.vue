<script setup lang="ts">
  import { uniform, vec4 } from 'three/tsl'

  import { saturate } from '../../shaders/common/blend'

  const { amount = 0.5, order = 0 } = defineProps<{
    /** Saturation boost: 0 = unchanged, positive = more saturated */
    amount?: number
    order?: number
  }>()

  const amountNode = uniform(amount)
  watch(
    () => amount,
    (v) => {
      amountNode.value = v
    }
  )

  useShaderStage((prev) => vec4(saturate(prev.xyz, amountNode), prev.w), order)
</script>

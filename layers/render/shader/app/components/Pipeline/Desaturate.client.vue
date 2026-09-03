<script setup lang="ts">
  import { uniform, vec4 } from 'three/tsl'

  import { desaturate } from '../../shaders/common/blend'

  const { amount = 1, order = 0 } = defineProps<{
    /** 0 = original colour, 1 = full greyscale */
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

  useShaderStage((prev) => vec4(desaturate(prev.xyz, amountNode), prev.w), order)
</script>

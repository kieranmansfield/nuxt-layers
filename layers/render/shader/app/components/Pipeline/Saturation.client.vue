<script setup lang="ts">
  import { vec4 } from 'three/tsl'

  import { saturate } from '../../shaders/common/blend'

  const { amount = 0.5, order = 0 } = defineProps<{
    /** Saturation boost: 0 = unchanged, positive = more saturated */
    amount?: number
    order?: number
  }>()

  const amountNode = useUniformProp(() => amount)

  useShaderStage((prev) => vec4(saturate(prev.xyz, amountNode), prev.w), order)
</script>

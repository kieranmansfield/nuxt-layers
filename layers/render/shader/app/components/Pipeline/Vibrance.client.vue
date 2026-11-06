<script setup lang="ts">
  import { vec4 } from 'three/tsl'

  import { vibrance } from '../../shaders/common/palette'

  const { amount = 0.5, order = 0 } = defineProps<{
    /**
     * Saturation boost that protects already-saturated colours.
     * 0 = unchanged, positive = more vivid, negative = less.
     */
    amount?: number
    order?: number
  }>()

  const amountNode = useUniformProp(() => amount)

  useShaderStage((prev) => vec4(vibrance(prev.xyz, amountNode), prev.w), order)
</script>

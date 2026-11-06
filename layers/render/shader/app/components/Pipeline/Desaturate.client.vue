<script setup lang="ts">
  import { vec4 } from 'three/tsl'

  import { desaturate } from '../../shaders/common/blend'

  const { amount = 1, order = 0 } = defineProps<{
    /** 0 = original colour, 1 = full greyscale */
    amount?: number
    order?: number
  }>()

  const amountNode = useUniformProp(() => amount)

  useShaderStage((prev) => vec4(desaturate(prev.xyz, amountNode), prev.w), order)
</script>

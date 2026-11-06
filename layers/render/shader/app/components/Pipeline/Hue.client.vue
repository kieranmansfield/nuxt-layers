<script setup lang="ts">
  import { vec4 } from 'three/tsl'

  import { hueShift } from '../../shaders/common/palette'

  const { shift = 0, order = 0 } = defineProps<{
    /** Hue shift amount in [0, 1] (1 = full rotation) */
    shift?: number
    order?: number
  }>()

  const shiftNode = useUniformProp(() => shift)

  useShaderStage((prev) => vec4(hueShift(prev.xyz, shiftNode), prev.w), order)
</script>

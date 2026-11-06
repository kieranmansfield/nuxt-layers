<script setup lang="ts">
  import { vec4 } from 'three/tsl'

  import { desaturate } from '../../shaders/common/blend'

  const {
    color = '#4466aa',
    desaturation = 1,
    order = 0,
  } = defineProps<{
    /** Tint colour applied after desaturation */
    color?: string
    /** How much to desaturate before tinting: 1 = full greyscale */
    desaturation?: number
    order?: number
  }>()

  const colorNode = useColorProp(() => color)
  const desatNode = useUniformProp(() => desaturation)

  useShaderStage((prev) => vec4(desaturate(prev.xyz, desatNode).mul(colorNode), prev.w), order)
</script>

<script setup lang="ts">
  import { Color } from 'three'
  import { uniform, vec4 } from 'three/tsl'

  import { desaturate } from '../../shaders/common/blend'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

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

  const colorNode = hexToVec3Uniform(color)
  const desatNode = uniform(desaturation)
  watch(
    () => color,
    (v) => {
      const c = new Color(v)
      colorNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => desaturation,
    (v) => {
      desatNode.value = v
    }
  )

  useShaderStage((prev) => vec4(desaturate(prev.xyz, desatNode).mul(colorNode), prev.w), order)
</script>

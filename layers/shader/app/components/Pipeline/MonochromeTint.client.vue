<script setup lang="ts">
  import { Color, Vector3 } from 'three'
  import { uniform, vec4 } from 'three/tsl'

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

  function toVec3Node(hex: string) {
    const c = new Color(hex)
    return uniform(new Vector3(c.r, c.g, c.b))
  }

  const colorNode = toVec3Node(color)
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

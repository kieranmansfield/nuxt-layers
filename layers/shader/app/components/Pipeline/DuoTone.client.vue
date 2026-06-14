<script setup lang="ts">
  import { Color, Vector3 } from 'three'
  import { mix, uniform, vec4 } from 'three/tsl'

  import { luminance } from '../../shaders/common/blend'

  const {
    shadowColor = '#1a0033',
    highlightColor = '#ffcc00',
    order = 0,
  } = defineProps<{
    /** Shadow colour (low luminance) */
    shadowColor?: string
    /** Highlight colour (high luminance) */
    highlightColor?: string
    order?: number
  }>()

  function toVec3Node(hex: string) {
    const c = new Color(hex)
    return uniform(new Vector3(c.r, c.g, c.b))
  }

  const shadowNode = toVec3Node(shadowColor)
  const highlightNode = toVec3Node(highlightColor)
  watch(
    () => shadowColor,
    (v) => {
      const c = new Color(v)
      shadowNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => highlightColor,
    (v) => {
      const c = new Color(v)
      highlightNode.value.set(c.r, c.g, c.b)
    }
  )

  useShaderStage((prev) => {
    const lum = luminance(prev.xyz)
    return vec4(mix(shadowNode, highlightNode, lum), prev.w)
  }, order)
</script>

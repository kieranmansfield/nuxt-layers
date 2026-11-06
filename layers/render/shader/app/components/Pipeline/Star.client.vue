<script setup lang="ts">
  import { star } from '../../shaders/common/shapes'

  const {
    colorA = '#000000',
    colorB = '#ffcc00',
    radius = 0.35,
    points = 5,
    innerRatio = 0.45,
    softness = 0.01,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    radius?: number
    /** Number of points */
    points?: number
    /** Inner radius ratio (0–1) */
    innerRatio?: number
    softness?: number
    order?: number
  }>()

  const radiusNode = useUniformProp(() => radius)
  const innerNode = useUniformProp(() => innerRatio)
  const softnessNode = useUniformProp(() => softness)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const mask = star(uv, [0.5, 0.5], points, innerNode, radiusNode, softnessNode)
      return mask
    },
    order
  )
</script>

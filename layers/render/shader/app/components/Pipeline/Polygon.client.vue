<script setup lang="ts">
  import { polygon } from '../../shaders/common/shapes'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    sides = 6,
    radius = 0.35,
    softness = 0.01,
    rotation = 0,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    /** Number of sides */
    sides?: number
    radius?: number
    softness?: number
    /** Rotation offset in degrees */
    rotation?: number
    order?: number
  }>()

  const radiusNode = useUniformProp(() => radius)
  const softnessNode = useUniformProp(() => softness)
  const rotationNode = useUniformProp(() => (rotation * Math.PI) / 180)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const mask = polygon(uv, [0.5, 0.5], sides, radiusNode, rotationNode, softnessNode)
      return mask
    },
    order
  )
</script>

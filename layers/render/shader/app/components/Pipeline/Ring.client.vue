<script setup lang="ts">
  import { ring } from '../../shaders/common/shapes'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    innerRadius = 0.25,
    outerRadius = 0.4,
    softness = 0.01,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    innerRadius?: number
    outerRadius?: number
    softness?: number
    order?: number
  }>()

  const innerNode = useUniformProp(() => innerRadius)
  const outerNode = useUniformProp(() => outerRadius)
  const softnessNode = useUniformProp(() => softness)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const mask = ring(uv, [0.5, 0.5], innerNode, outerNode, softnessNode)
      return mask
    },
    order
  )
</script>

<script setup lang="ts">
  import { dots } from '../../shaders/common/shapes'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    cellSize = 0.08,
    dotRadius = 0.025,
    softness = 0.005,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    cellSize?: number
    dotRadius?: number
    softness?: number
    order?: number
  }>()

  const cellNode = useUniformProp(() => cellSize)
  const dotNode = useUniformProp(() => dotRadius)
  const softNode = useUniformProp(() => softness)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const mask = dots(uv, cellNode, dotNode, softNode)
      return mask
    },
    order
  )
</script>

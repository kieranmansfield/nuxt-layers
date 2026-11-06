<script setup lang="ts">
  import { grid } from '../../shaders/common/shapes'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    cellSize = 0.1,
    lineWidth = 0.005,
    order = 0,
  } = defineProps<{
    /** Background colour */
    colorA?: string
    /** Grid line colour */
    colorB?: string
    cellSize?: number
    lineWidth?: number
    order?: number
  }>()

  const cellNode = useUniformProp(() => cellSize)
  const lineNode = useUniformProp(() => lineWidth)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const mask = grid(uv, cellNode, lineNode)
      return mask
    },
    order
  )
</script>

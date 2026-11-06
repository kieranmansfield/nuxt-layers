<script setup lang="ts">
  import { vec2 } from 'three/tsl'

  import { roundedRect } from '../../shaders/common/shapes'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    width = 0.6,
    height = 0.4,
    cornerRadius = 0.05,
    softness = 0.01,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    width?: number
    height?: number
    cornerRadius?: number
    softness?: number
    order?: number
  }>()

  const widthNode = useUniformProp(() => width)
  const heightNode = useUniformProp(() => height)
  const cornerNode = useUniformProp(() => cornerRadius)
  const softnessNode = useUniformProp(() => softness)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const mask = roundedRect(
        uv,
        [0.5, 0.5],
        vec2(widthNode, heightNode),
        cornerNode,
        softnessNode
      )
      return mask
    },
    order
  )
</script>

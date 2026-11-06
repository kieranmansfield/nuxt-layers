<script setup lang="ts">
  import { smoothstep } from 'three/tsl'

  import { sdEquilateralTriangle } from '../../shaders/common/sdf'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    size = 0.35,
    softness = 0.01,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    size?: number
    softness?: number
    order?: number
  }>()

  const sizeNode = useUniformProp(() => size)
  const softnessNode = useUniformProp(() => softness)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const d = sdEquilateralTriangle(uv.sub(0.5), sizeNode)
      const mask = smoothstep(softnessNode, softnessNode.negate(), d)
      return mask
    },
    order
  )
</script>

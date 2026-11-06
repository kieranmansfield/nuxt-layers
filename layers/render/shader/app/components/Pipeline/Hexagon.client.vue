<script setup lang="ts">
  // fallow-ignore-file code-duplication
  import { smoothstep } from 'three/tsl'

  import { sdHexagon } from '../../shaders/common/sdf'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    radius = 0.35,
    softness = 0.01,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    radius?: number
    softness?: number
    order?: number
  }>()

  const radiusNode = useUniformProp(() => radius)
  const softnessNode = useUniformProp(() => softness)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const d = sdHexagon(uv.sub(0.5), radiusNode)
      const mask = smoothstep(softnessNode, softnessNode.negate(), d)
      return mask
    },
    order
  )
</script>

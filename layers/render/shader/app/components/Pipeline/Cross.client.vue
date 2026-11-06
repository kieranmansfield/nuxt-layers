<script setup lang="ts">
  import { smoothstep, vec2 } from 'three/tsl'

  import { sdRoundedBox2d } from '../../shaders/common/sdf'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    size = 0.4,
    thickness = 0.1,
    softness = 0.01,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    /** Length of each arm, from the centre */
    size?: number
    /** Width of each arm */
    thickness?: number
    softness?: number
    order?: number
  }>()

  const sizeNode = useUniformProp(() => size)
  const thickNode = useUniformProp(() => thickness)
  const softnessNode = useUniformProp(() => softness)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const p = uv.sub(0.5)
      const halfThick = thickNode.div(2)
      const d = sdRoundedBox2d(p, vec2(sizeNode, halfThick)).min(
        sdRoundedBox2d(p, vec2(halfThick, sizeNode))
      )
      const mask = smoothstep(softnessNode, softnessNode.negate(), d)
      return mask
    },
    order
  )
</script>

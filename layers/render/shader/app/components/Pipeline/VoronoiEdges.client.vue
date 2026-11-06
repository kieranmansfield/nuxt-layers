<script setup lang="ts">
  // fallow-ignore-file code-duplication
  import { smoothstep, time } from 'three/tsl'

  import { voronoi2D } from '../../shaders/common/noise'

  /** Voronoi cell edge lines only — the cell boundaries as thin lines. */
  const {
    colorA = '#000000',
    colorB = '#ffffff',
    scale = 8,
    edgeWidth = 0.05,
    speed = 0.1,
    order = 0,
  } = defineProps<{
    /** Cell background colour */
    colorA?: string
    /** Edge line colour */
    colorB?: string
    scale?: number
    /** Edge line thickness */
    edgeWidth?: number
    speed?: number
    order?: number
  }>()

  const scaleNode = useUniformProp(() => scale)
  const edgeNode = useUniformProp(() => edgeWidth)
  const speedNode = useUniformProp(() => speed)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const { distance } = voronoi2D(uv.add(time.mul(speedNode)), scaleNode)
      // Edge = near-zero distance → smooth threshold
      const edge = smoothstep(edgeNode, edgeNode.mul(0.1), distance)
      return edge
    },
    order
  )
</script>

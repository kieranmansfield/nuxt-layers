<script setup lang="ts">
  // fallow-ignore-file code-duplication
  import { float, time } from 'three/tsl'

  import { voronoi2D } from '../../shaders/common/noise'

  const {
    colorA = '#000033',
    colorB = '#ffffff',
    scale = 8,
    speed = 0.1,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    scale?: number
    speed?: number
    order?: number
  }>()

  const scaleNode = useUniformProp(() => scale)
  const speedNode = useUniformProp(() => speed)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const { distance } = voronoi2D(uv.add(time.mul(speedNode)), scaleNode)
      return distance.min(float(1))
    },
    order
  )
</script>

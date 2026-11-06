<script setup lang="ts">
  // fallow-ignore-file code-duplication
  import { time, vec3 } from 'three/tsl'

  import { gradientNoise3D } from '../../shaders/common/noise'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    scale = 3,
    speed = 0.2,
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
      const t = time.mul(speedNode)
      const n = gradientNoise3D(vec3(uv.mul(scaleNode), t))
        .mul(0.5)
        .add(0.5)
      return n
    },
    order
  )
</script>

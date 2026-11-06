<script setup lang="ts">
  import { time } from 'three/tsl'

  import { waveUV } from '../../shaders/common/uv'

  const {
    frequency = 10,
    amplitude = 0.05,
    speed = 1,
    order = 0,
  } = defineProps<{
    /** Wave frequency */
    frequency?: number
    /** Warp amplitude */
    amplitude?: number
    /** Animation speed */
    speed?: number
    order?: number
  }>()

  const freqNode = useUniformProp(() => frequency)
  const ampNode = useUniformProp(() => amplitude)
  const speedNode = useUniformProp(() => speed)

  useShaderStage(
    (uvIn) => waveUV(uvIn, freqNode, ampNode, time.mul(speedNode), 'both'),
    order,
    'uv'
  )
</script>

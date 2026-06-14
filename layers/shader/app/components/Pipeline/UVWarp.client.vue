<script setup lang="ts">
  import { time, uniform } from 'three/tsl'

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

  const freqNode = uniform(frequency)
  const ampNode = uniform(amplitude)
  const speedNode = uniform(speed)
  watch(
    () => frequency,
    (v) => {
      freqNode.value = v
    }
  )
  watch(
    () => amplitude,
    (v) => {
      ampNode.value = v
    }
  )
  watch(
    () => speed,
    (v) => {
      speedNode.value = v
    }
  )

  useShaderStage(
    (uvIn) => waveUV(uvIn, freqNode, ampNode, time.mul(speedNode), 'both'),
    order,
    'uv'
  )
</script>

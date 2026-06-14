<script setup lang="ts">
  import { time, uniform } from 'three/tsl'

  import { rippleUV } from '../../shaders/common/uv'

  const {
    frequency = 10,
    amplitude = 0.05,
    falloff = 1,
    speed = 1,
    order = 0,
  } = defineProps<{
    /** Ripple frequency */
    frequency?: number
    /** Ripple amplitude */
    amplitude?: number
    /** Falloff rate from center */
    falloff?: number
    /** Animation speed */
    speed?: number
    order?: number
  }>()

  const freqNode = uniform(frequency)
  const ampNode = uniform(amplitude)
  const falloffNode = uniform(falloff)
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
    () => falloff,
    (v) => {
      falloffNode.value = v
    }
  )
  watch(
    () => speed,
    (v) => {
      speedNode.value = v
    }
  )

  useShaderStage(
    (uvIn) => rippleUV(uvIn, [0.5, 0.5], freqNode, ampNode, time.mul(speedNode), falloffNode),
    order,
    'uv'
  )
</script>

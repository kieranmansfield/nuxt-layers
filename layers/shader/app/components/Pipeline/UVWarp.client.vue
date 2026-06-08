<!-- eslint-disable vue/define-props-destructuring -->
<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
  // @ts-nocheck
  import { time, uniform } from 'three/tsl'

  import { waveUV } from '../../shaders/common/uv'

  const props = withDefaults(
    defineProps<{
      /** Wave frequency */
      frequency?: number
      /** Warp amplitude */
      amplitude?: number
      /** Animation speed */
      speed?: number
      order?: number
    }>(),
    { frequency: 10, amplitude: 0.05, speed: 1, order: 0 }
  )

  const freqNode = uniform(props.frequency)
  const ampNode = uniform(props.amplitude)
  const speedNode = uniform(props.speed)
  watch(
    () => props.frequency,
    (v) => {
      freqNode.value = v
    }
  )
  watch(
    () => props.amplitude,
    (v) => {
      ampNode.value = v
    }
  )
  watch(
    () => props.speed,
    (v) => {
      speedNode.value = v
    }
  )

  useShaderStage(
    (uvIn) => waveUV(uvIn, freqNode, ampNode, time.mul(speedNode), 'both'),
    props.order,
    'uv'
  )
</script>

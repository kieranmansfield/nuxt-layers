<script setup lang="ts">
  import { time } from 'three/tsl'

  import { rotateVec3X, rotateVec3Y } from '../../shaders/common/math'

  const {
    speed = 0.5,
    pitch = 0,
    order = 0,
  } = defineProps<{
    /** Orbit speed in radians per second (Y axis) */
    speed?: number
    /** Additional fixed pitch in radians (X axis) */
    pitch?: number
    order?: number
  }>()

  const speedNode = useUniformProp(() => speed)
  const pitchNode = useUniformProp(() => pitch)

  // Y-axis orbit, then X-axis pitch
  useShaderStage(
    (ray) => rotateVec3X(rotateVec3Y(ray, time.mul(speedNode)), pitchNode),
    order,
    'ray'
  )
</script>

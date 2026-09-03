<script setup lang="ts">
  import { cos, sin, time, uniform, vec3 } from 'three/tsl'

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

  const speedNode = uniform(speed)
  const pitchNode = uniform(pitch)
  watch(
    () => speed,
    (v) => {
      speedNode.value = v
    }
  )
  watch(
    () => pitch,
    (v) => {
      pitchNode.value = v
    }
  )

  useShaderStage(
    (ray) => {
      const yaw = time.mul(speedNode)

      // Y-axis rotation (orbit)
      const cy = cos(yaw)
      const sy = sin(yaw)
      const rayY = vec3(ray.x.mul(cy).add(ray.z.mul(sy)), ray.y, ray.z.mul(cy).sub(ray.x.mul(sy)))

      // X-axis pitch
      const cp = cos(pitchNode)
      const sp = sin(pitchNode)
      return vec3(rayY.x, rayY.y.mul(cp).sub(rayY.z.mul(sp)), rayY.y.mul(sp).add(rayY.z.mul(cp)))
    },
    order,
    'ray'
  )
</script>

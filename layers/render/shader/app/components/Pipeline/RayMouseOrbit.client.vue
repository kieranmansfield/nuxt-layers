<script setup lang="ts">
  import { Vector2 } from 'three'
  import { cos, sin, uniform, vec3 } from 'three/tsl'

  const {
    yawRange = Math.PI,
    pitchRange = Math.PI / 3,
    order = 0,
  } = defineProps<{
    /** Multiplier for horizontal mouse sweep → yaw range (radians) */
    yawRange?: number
    /** Multiplier for vertical mouse sweep → pitch range (radians) */
    pitchRange?: number
    order?: number
  }>()

  const mouse = uniform(new Vector2(0.5, 0.5))

  onMounted(() => {
    const onMove = (e: MouseEvent) => {
      mouse.value.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', onMove)
    onUnmounted(() => window.removeEventListener('mousemove', onMove))
  })

  const yawRangeNode = uniform(yawRange)
  const pitchRangeNode = uniform(pitchRange)
  watch(
    () => yawRange,
    (v) => {
      yawRangeNode.value = v
    }
  )
  watch(
    () => pitchRange,
    (v) => {
      pitchRangeNode.value = v
    }
  )

  useShaderStage(
    (ray) => {
      const yaw = mouse.x.sub(0.5).mul(yawRangeNode)
      const pitch = mouse.y.sub(0.5).mul(pitchRangeNode)

      // Yaw (Y-axis)
      const cy = cos(yaw)
      const sy = sin(yaw)
      const rayY = vec3(ray.x.mul(cy).add(ray.z.mul(sy)), ray.y, ray.z.mul(cy).sub(ray.x.mul(sy)))

      // Pitch (X-axis)
      const cp = cos(pitch)
      const sp = sin(pitch)
      return vec3(rayY.x, rayY.y.mul(cp).sub(rayY.z.mul(sp)), rayY.y.mul(sp).add(rayY.z.mul(cp)))
    },
    order,
    'ray'
  )
</script>

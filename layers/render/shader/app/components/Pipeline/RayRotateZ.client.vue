<script setup lang="ts">
  import { cos, sin, uniform, vec3 } from 'three/tsl'

  const { angle = 0, order = 0 } = defineProps<{
    /** Rotation angle in radians */
    angle?: number
    order?: number
  }>()

  const angleNode = uniform(angle)
  watch(
    () => angle,
    (v) => {
      angleNode.value = v
    }
  )

  useShaderStage(
    (ray) => {
      const c = cos(angleNode)
      const s = sin(angleNode)
      return vec3(ray.x.mul(c).sub(ray.y.mul(s)), ray.x.mul(s).add(ray.y.mul(c)), ray.z)
    },
    order,
    'ray'
  )
</script>

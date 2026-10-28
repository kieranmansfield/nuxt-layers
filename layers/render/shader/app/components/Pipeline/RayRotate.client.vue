<script setup lang="ts">
  import { cos, sin, uniform, vec3 } from 'three/tsl'

  /**
   * Rotates the ray direction around one axis (v7 merged RayRotateX/Y/Z). `axis` is read
   * once, when the node graph is built; give the node a `:key` to change it at runtime.
   * `angle` updates live.
   */
  const {
    axis = 'y',
    angle = 0,
    order = 0,
  } = defineProps<{
    axis?: 'x' | 'y' | 'z'
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
      if (axis === 'x')
        return vec3(ray.x, ray.y.mul(c).sub(ray.z.mul(s)), ray.y.mul(s).add(ray.z.mul(c)))
      if (axis === 'y')
        return vec3(ray.x.mul(c).add(ray.z.mul(s)), ray.y, ray.z.mul(c).sub(ray.x.mul(s)))
      return vec3(ray.x.mul(c).sub(ray.y.mul(s)), ray.x.mul(s).add(ray.y.mul(c)), ray.z)
    },
    order,
    'ray'
  )
</script>

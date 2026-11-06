<script setup lang="ts">
  // fallow-ignore-file code-duplication
  import { cos, sin, vec3 } from 'three/tsl'

  const { angle = 0, order = 0 } = defineProps<{
    /** Rotation angle in radians */
    angle?: number
    order?: number
  }>()

  const angleNode = useUniformProp(() => angle)

  useShaderStage(
    (ray) => {
      const c = cos(angleNode)
      const s = sin(angleNode)
      return vec3(ray.x.mul(c).add(ray.z.mul(s)), ray.y, ray.z.mul(c).sub(ray.x.mul(s)))
    },
    order,
    'ray'
  )
</script>

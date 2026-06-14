<script setup lang="ts">
  import { atan, float, uniform, vec3 } from 'three/tsl'

  const { fov = Math.PI, order = 0 } = defineProps<{
    /**
     * Field-of-view in radians for the fisheye projection.
     * π = 180° hemisphere, π*2 = full sphere.
     */
    fov?: number
    order?: number
  }>()

  const fovNode = uniform(fov)
  watch(
    () => fov,
    (v) => {
      fovNode.value = v
    }
  )

  useShaderStage(
    (ray) => {
      // Screen-space xy from the linear ray (z = 1 focal plane)
      const screen = vec3(ray.x, ray.y, float(0))
      const r = screen.length()

      // Fisheye: map linear distance → angle on sphere
      const theta = atan(r)
        .mul(fovNode)
        .div(Math.PI * 0.5)
      const phi = screen.y.atan(screen.x)

      const sinTheta = theta.sin()
      return vec3(phi.cos().mul(sinTheta), phi.sin().mul(sinTheta), theta.cos()).normalize()
    },
    order,
    'ray'
  )
</script>

<script setup lang="ts">
  import { uniform, vec2 } from 'three/tsl'

  const {
    shearX = 0.2,
    shearY = 0,
    order = 0,
  } = defineProps<{
    /** Horizontal shear: shifts X by Y * shearX */
    shearX?: number
    /** Vertical shear: shifts Y by X * shearY */
    shearY?: number
    order?: number
  }>()

  const shearXNode = uniform(shearX)
  const shearYNode = uniform(shearY)
  watch(
    () => shearX,
    (v) => {
      shearXNode.value = v
    }
  )
  watch(
    () => shearY,
    (v) => {
      shearYNode.value = v
    }
  )

  useShaderStage(
    (uvIn) => vec2(uvIn.x.add(uvIn.y.mul(shearXNode)), uvIn.y.add(uvIn.x.mul(shearYNode))),
    order,
    'uv'
  )
</script>

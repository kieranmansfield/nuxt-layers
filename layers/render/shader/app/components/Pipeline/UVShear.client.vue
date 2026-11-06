<script setup lang="ts">
  import { vec2 } from 'three/tsl'

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

  const shearXNode = useUniformProp(() => shearX)
  const shearYNode = useUniformProp(() => shearY)

  useShaderStage(
    (uvIn) => vec2(uvIn.x.add(uvIn.y.mul(shearXNode)), uvIn.y.add(uvIn.x.mul(shearYNode))),
    order,
    'uv'
  )
</script>

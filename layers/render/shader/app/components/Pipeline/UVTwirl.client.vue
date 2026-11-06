<script setup lang="ts">
  import { swirlUV } from '../../shaders/common/uv'

  const {
    strength = 3,
    radius = 0.5,
    order = 0,
  } = defineProps<{
    /** Swirl strength in radians */
    strength?: number
    /** Effective radius of the swirl */
    radius?: number
    order?: number
  }>()

  const strengthNode = useUniformProp(() => strength)
  const radiusNode = useUniformProp(() => radius)

  useShaderStage((uvIn) => swirlUV(uvIn, [0.5, 0.5], strengthNode, radiusNode), order, 'uv')
</script>

<script setup lang="ts">
  import { uniform } from 'three/tsl'

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

  const strengthNode = uniform(strength)
  const radiusNode = uniform(radius)
  watch(
    () => strength,
    (v) => {
      strengthNode.value = v
    }
  )
  watch(
    () => radius,
    (v) => {
      radiusNode.value = v
    }
  )

  useShaderStage((uvIn) => swirlUV(uvIn, [0.5, 0.5], strengthNode, radiusNode), order, 'uv')
</script>

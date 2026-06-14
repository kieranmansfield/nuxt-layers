<script setup lang="ts">
  import { uniform } from 'three/tsl'

  import { bulgeUV } from '../../shaders/common/uv'

  const {
    strength = 0.5,
    radius = 0.5,
    order = 0,
  } = defineProps<{
    /** Positive = bulge outward, negative = pinch inward */
    strength?: number
    /** Effective radius of the distortion */
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

  useShaderStage(
    (uvIn) => bulgeUV(uvIn, { strength: strengthNode, radius: radiusNode }),
    order,
    'uv'
  )
</script>

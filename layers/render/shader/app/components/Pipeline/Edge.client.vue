<script setup lang="ts">
  import { mix, uniform, vec3, vec4 } from 'three/tsl'
  import { sobel } from 'three/addons/tsl/display/SobelOperatorNode.js'

  const {
    strength = 1,
    keepColor = 0,
    order = 0,
  } = defineProps<{
    /** Edge intensity multiplier */
    strength?: number
    /** Blend back the original colour under the edges (0 = edges only, 1 = original) */
    keepColor?: number
    order?: number
  }>()

  const strengthNode = uniform(strength)
  const keepNode = uniform(keepColor)
  watch(
    () => strength,
    (v) => {
      strengthNode.value = v
    }
  )
  watch(
    () => keepColor,
    (v) => {
      keepNode.value = v
    }
  )

  useShaderStage((prev) => {
    const edges = sobel(prev).x.mul(strengthNode)
    return vec4(mix(vec3(edges), prev.xyz, keepNode), prev.w)
  }, order)
</script>

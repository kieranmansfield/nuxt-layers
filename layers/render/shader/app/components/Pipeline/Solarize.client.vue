<script setup lang="ts">
  import { mix, step, uniform, vec3, vec4 } from 'three/tsl'

  const {
    threshold = 0.5,
    order = 0,
  } = defineProps<{
    /** Channel level above which values invert (0-1) */
    threshold?: number
    order?: number
  }>()

  const thresholdNode = uniform(threshold)
  watch(
    () => threshold,
    (v) => {
      thresholdNode.value = v
    }
  )

  useShaderStage((prev) => {
    const inv = vec3(1).sub(prev.xyz)
    return vec4(mix(prev.xyz, inv, step(thresholdNode, prev.xyz)), prev.w)
  }, order)
</script>

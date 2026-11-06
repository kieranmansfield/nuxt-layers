<script setup lang="ts">
  import { float, pow, vec4 } from 'three/tsl'

  const { stops = 0, order = 0 } = defineProps<{
    /** Exposure in stops: 0 = unchanged, +1 = 2× brighter, -1 = 2× darker */
    stops?: number
    order?: number
  }>()

  const stopsNode = useUniformProp(() => stops)

  useShaderStage((prev) => {
    const scale = pow(float(2), stopsNode)
    return vec4(prev.xyz.mul(scale), prev.w)
  }, order)
</script>

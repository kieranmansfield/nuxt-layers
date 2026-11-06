<script setup lang="ts">
  import { float, step, vec4 } from 'three/tsl'

  import { luminance } from '../../shaders/common/blend'

  const { threshold = 0.5, order = 0 } = defineProps<{
    /** Luminance threshold 0–1: below = black, above = white */
    threshold?: number
    order?: number
  }>()

  const thresholdNode = useUniformProp(() => threshold)

  useShaderStage((prev) => {
    const lum = luminance(prev.xyz)
    const t = step(thresholdNode, lum)
    return vec4(float(t), float(t), float(t), prev.w)
  }, order)
</script>

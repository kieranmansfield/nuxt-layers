<script setup lang="ts">
  import { clamp, vec4 } from 'three/tsl'

  const {
    frequency = 8,
    scale = 0.15,
    order = 0,
  } = defineProps<{
    /** Number of bands across the UV Y axis */
    frequency?: number
    /** Brightness addend at band peaks */
    scale?: number
    order?: number
  }>()

  const freqNode = useUniformProp(() => frequency)
  const scaleNode = useUniformProp(() => scale)

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const uvCurrent = pipeline.uvNode.value
    const band = uvCurrent.y.mul(freqNode).fract().mul(scaleNode)
    const rgb = clamp(prev.xyz.add(band), 0, 1)
    return vec4(rgb, prev.w)
  }, order)
</script>

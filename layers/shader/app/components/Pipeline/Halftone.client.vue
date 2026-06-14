<script setup lang="ts">
  import { uniform, vec4 } from 'three/tsl'

  import { luminance } from '../../shaders/common/blend'
  import { halftone } from '../../shaders/common/grain'

  const {
    scale = 50,
    angle = 0,
    order = 0,
  } = defineProps<{
    /** Dot density — higher = finer dots */
    scale?: number
    /** Screen angle in radians */
    angle?: number
    order?: number
  }>()

  const scaleNode = uniform(scale)
  const angleNode = uniform(angle)
  watch(
    () => scale,
    (v) => {
      scaleNode.value = v
    }
  )
  watch(
    () => angle,
    (v) => {
      angleNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const uvCurrent = pipeline.uvNode.value
    const lum = luminance(prev.xyz)
    const dot = halftone(uvCurrent, lum, scaleNode, angleNode)
    return vec4(prev.xyz.mul(dot), prev.w)
  }, order)
</script>

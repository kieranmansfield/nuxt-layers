<script setup lang="ts">
  import { vec4 } from 'three/tsl'

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

  const scaleNode = useUniformProp(() => scale)
  const angleNode = useUniformProp(() => angle)

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const uvCurrent = pipeline.uvNode.value
    const lum = luminance(prev.xyz)
    const dot = halftone(uvCurrent, lum, scaleNode, angleNode)
    return vec4(prev.xyz.mul(dot), prev.w)
  }, order)
</script>

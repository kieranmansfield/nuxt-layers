<script setup lang="ts">
  import { vec4 } from 'three/tsl'

  import { vignette } from '../../shaders/common/grain'

  const {
    intensity = 0.5,
    smoothness = 0.5,
    order = 0,
  } = defineProps<{
    intensity?: number
    smoothness?: number
    order?: number
  }>()

  const intensityNode = useUniformProp(() => intensity)
  const smoothnessNode = useUniformProp(() => smoothness)

  const { uvNode } = useShaderPipelineContext()

  useShaderStage((prev) => {
    const v = vignette(uvNode.value, intensityNode, smoothnessNode)
    return vec4(prev.xyz.mul(v), prev.w)
  }, order)
</script>

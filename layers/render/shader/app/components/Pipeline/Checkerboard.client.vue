<script setup lang="ts">
  import { mix, vec4 } from 'three/tsl'

  import { checker } from '../../shaders/common/shapes'

  const {
    colorA = '#ffffff',
    colorB = '#000000',
    scale = 10,
    order = 0,
  } = defineProps<{
    /** First checker colour */
    colorA?: string
    /** Second checker colour */
    colorB?: string
    /** Number of checker tiles across each axis */
    scale?: number
    order?: number
  }>()

  const colorANode = useColorProp(() => colorA)
  const colorBNode = useColorProp(() => colorB)
  const scaleNode = useUniformProp(() => scale)

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uvCurrent = pipeline.uvNode.value
    const t = checker(uvCurrent, scaleNode)
    return vec4(mix(colorANode, colorBNode, t), 1.0)
  }, order)
</script>

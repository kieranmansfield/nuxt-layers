<script setup lang="ts">
  import { Color } from 'three'
  import { float, mix, vec4 } from 'three/tsl'

  import { grid } from '../../shaders/common/shapes'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    cellSize = 0.1,
    lineWidth = 0.005,
    order = 0,
  } = defineProps<{
    /** Background colour */
    colorA?: string
    /** Grid line colour */
    colorB?: string
    cellSize?: number
    lineWidth?: number
    order?: number
  }>()

  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
  const cellNode = useUniformProp(() => cellSize)
  const lineNode = useUniformProp(() => lineWidth)
  watch(
    () => colorA,
    (v) => {
      const c = new Color(v)
      colorANode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => colorB,
    (v) => {
      const c = new Color(v)
      colorBNode.value.set(c.r, c.g, c.b)
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uv = pipeline.uvNode.value
    const mask = grid(uv, cellNode, lineNode)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  }, order)
</script>

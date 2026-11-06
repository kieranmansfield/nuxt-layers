<script setup lang="ts">
  import { Color } from 'three'
  import { float, mix, vec4 } from 'three/tsl'

  import { dots } from '../../shaders/common/shapes'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    cellSize = 0.08,
    dotRadius = 0.025,
    softness = 0.005,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    cellSize?: number
    dotRadius?: number
    softness?: number
    order?: number
  }>()

  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
  const cellNode = useUniformProp(() => cellSize)
  const dotNode = useUniformProp(() => dotRadius)
  const softNode = useUniformProp(() => softness)
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
    const mask = dots(uv, cellNode, dotNode, softNode)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  }, order)
</script>

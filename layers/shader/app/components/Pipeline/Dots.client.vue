<script setup lang="ts">
  import { Color } from 'three'
  import { float, mix, uniform, vec4 } from 'three/tsl'

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
  const cellNode = uniform(cellSize)
  const dotNode = uniform(dotRadius)
  const softNode = uniform(softness)
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
  watch(
    () => cellSize,
    (v) => {
      cellNode.value = v
    }
  )
  watch(
    () => dotRadius,
    (v) => {
      dotNode.value = v
    }
  )
  watch(
    () => softness,
    (v) => {
      softNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uv = pipeline.uvNode.value
    const mask = dots(uv, cellNode, dotNode, softNode)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  }, order)
</script>

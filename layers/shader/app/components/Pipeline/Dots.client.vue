<script setup lang="ts">
  import { Color, Vector3 } from 'three'
  import { float, mix, uniform, vec4 } from 'three/tsl'

  import { dots } from '../../shaders/common/shapes'

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

  function toVec3Node(hex: string) {
    const c = new Color(hex)
    return uniform(new Vector3(c.r, c.g, c.b))
  }

  const colorANode = toVec3Node(colorA)
  const colorBNode = toVec3Node(colorB)
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

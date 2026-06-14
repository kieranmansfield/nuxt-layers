<script setup lang="ts">
  import { Color, Vector3 } from 'three'
  import { float, mix, uniform, vec4 } from 'three/tsl'

  import { grid } from '../../shaders/common/shapes'

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

  function toVec3Node(hex: string) {
    const c = new Color(hex)
    return uniform(new Vector3(c.r, c.g, c.b))
  }

  const colorANode = toVec3Node(colorA)
  const colorBNode = toVec3Node(colorB)
  const cellNode = uniform(cellSize)
  const lineNode = uniform(lineWidth)
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
    () => lineWidth,
    (v) => {
      lineNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uv = pipeline.uvNode.value
    const mask = grid(uv, cellNode, lineNode)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  }, order)
</script>

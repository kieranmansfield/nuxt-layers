<script setup lang="ts">
  import { Color } from 'three'
  import { mix, uniform, vec4 } from 'three/tsl'

  import { checker } from '../../shaders/common/shapes'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

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

  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
  const scaleNode = uniform(scale)
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
    () => scale,
    (v) => {
      scaleNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uvCurrent = pipeline.uvNode.value
    const t = checker(uvCurrent, scaleNode)
    return vec4(mix(colorANode, colorBNode, t), 1.0)
  }, order)
</script>

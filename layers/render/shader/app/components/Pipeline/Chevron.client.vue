<script setup lang="ts">
  import { Color } from 'three'
  import { float, mix, uniform, vec4 } from 'three/tsl'

  import { chevron } from '../../shaders/common/shapes'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    colorA = '#0f172a',
    colorB = '#38bdf8',
    count = 8,
    slope = 1,
    thickness = 0.5,
    softness = 0.02,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    /** Chevron bands across the height */
    count?: number
    /** Arm steepness */
    slope?: number
    /** Band thickness (0-1) */
    thickness?: number
    softness?: number
    order?: number
  }>()

  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
  const countNode = uniform(count)
  const slopeNode = uniform(slope)
  const thicknessNode = uniform(thickness)
  const softnessNode = uniform(softness)
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
    () => count,
    (v) => {
      countNode.value = v
    }
  )
  watch(
    () => slope,
    (v) => {
      slopeNode.value = v
    }
  )
  watch(
    () => thickness,
    (v) => {
      thicknessNode.value = v
    }
  )
  watch(
    () => softness,
    (v) => {
      softnessNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uv = pipeline.uvNode.value
    const mask = chevron(uv, countNode, slopeNode, thicknessNode, softnessNode)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  }, order)
</script>

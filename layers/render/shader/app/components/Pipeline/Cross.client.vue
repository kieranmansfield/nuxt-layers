<script setup lang="ts">
  import { Color } from 'three'
  import { float, mix, smoothstep, vec2, vec4 } from 'three/tsl'

  import { sdRoundedBox2d } from '../../shaders/common/sdf'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    size = 0.4,
    thickness = 0.1,
    softness = 0.01,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    /** Length of each arm, from the centre */
    size?: number
    /** Width of each arm */
    thickness?: number
    softness?: number
    order?: number
  }>()

  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
  const sizeNode = useUniformProp(() => size)
  const thickNode = useUniformProp(() => thickness)
  const softnessNode = useUniformProp(() => softness)
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
    const p = uv.sub(0.5)
    const halfThick = thickNode.div(2)
    const d = sdRoundedBox2d(p, vec2(sizeNode, halfThick)).min(
      sdRoundedBox2d(p, vec2(halfThick, sizeNode))
    )
    const mask = smoothstep(softnessNode, softnessNode.negate(), d)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  }, order)
</script>

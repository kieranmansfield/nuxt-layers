<script setup lang="ts">
  import { Color } from 'three'
  import { float, length, mix, smoothstep, uniform, vec2, vec4 } from 'three/tsl'

  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    radiusX = 0.35,
    radiusY = 0.2,
    softness = 0.01,
    colorA = '#000000',
    colorB = '#38bdf8',
    order = 0,
  } = defineProps<{
    /** Horizontal radius (UV) */
    radiusX?: number
    /** Vertical radius (UV) */
    radiusY?: number
    /** Edge softness */
    softness?: number
    /** Background colour */
    colorA?: string
    /** Foreground colour */
    colorB?: string
    order?: number
  }>()

  const radiusXNode = uniform(radiusX)
  const radiusYNode = uniform(radiusY)
  const softnessNode = uniform(softness)
  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
  watch(
    () => radiusX,
    (v) => {
      radiusXNode.value = v
    }
  )
  watch(
    () => radiusY,
    (v) => {
      radiusYNode.value = v
    }
  )
  watch(
    () => softness,
    (v) => {
      softnessNode.value = v
    }
  )
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
    const p = pipeline.uvNode.value.sub(0.5)
    const d = length(vec2(p.x.div(radiusXNode), p.y.div(radiusYNode)))
    const mask = float(1).sub(smoothstep(float(1).sub(softnessNode), float(1).add(softnessNode), d))
    return vec4(mix(colorANode, colorBNode, mask), 1.0)
  }, order)
</script>

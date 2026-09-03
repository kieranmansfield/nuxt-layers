<script setup lang="ts">
  import { Color, Vector2 } from 'three'
  import { float, smoothstep, uniform, vec2, vec4 } from 'three/tsl'

  import { hexToVec3Uniform } from '../../utils/tsl/color'

  /**
   * Orange/warm light leak emanating from a screen corner.
   * Additive over-exposure effect — common in analogue film.
   */
  const {
    color = '#ff8822',
    origin = [0, 1],
    radius = 0.7,
    intensity = 0.5,
    order = 0,
  } = defineProps<{
    /** Light leak colour */
    color?: string
    /** Corner origin [0,1] — default top-left */
    origin?: [number, number]
    /** Reach of the leak */
    radius?: number
    /** Peak brightness */
    intensity?: number
    order?: number
  }>()

  const colorNode = hexToVec3Uniform(color)
  const originNode = uniform(new Vector2(...origin))
  const radiusNode = uniform(radius)
  const intensityNode = uniform(intensity)
  watch(
    () => color,
    (v) => {
      const c = new Color(v)
      colorNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => origin,
    ([x, y]) => {
      originNode.value.set(x, y)
    }
  )
  watch(
    () => radius,
    (v) => {
      radiusNode.value = v
    }
  )
  watch(
    () => intensity,
    (v) => {
      intensityNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const uv = pipeline.uvNode.value
    const dist = uv.sub(vec2(originNode.x, originNode.y)).length()
    const leak = smoothstep(radiusNode, float(0), dist).mul(intensityNode)
    return vec4(prev.xyz.add(colorNode.mul(leak)), prev.w)
  }, order)
</script>

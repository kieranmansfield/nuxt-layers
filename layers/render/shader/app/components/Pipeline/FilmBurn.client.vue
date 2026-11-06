<script setup lang="ts">
  import { float, smoothstep, vec2, vec4 } from 'three/tsl'

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

  const colorNode = useColorProp(() => color)
  const originNode = useVector2Prop(() => origin)
  const radiusNode = useUniformProp(() => radius)
  const intensityNode = useUniformProp(() => intensity)

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const uv = pipeline.uvNode.value
    const dist = uv.sub(vec2(originNode.x, originNode.y)).length()
    const leak = smoothstep(radiusNode, float(0), dist).mul(intensityNode)
    return vec4(prev.xyz.add(colorNode.mul(leak)), prev.w)
  }, order)
</script>

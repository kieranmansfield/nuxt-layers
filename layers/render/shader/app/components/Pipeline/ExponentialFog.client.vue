<script setup lang="ts">
  import { mix, vec4 } from 'three/tsl'

  /**
   * Height-based exponential fog: exp2(-ray.y * density).
   * Blends prev colour toward fogColor as the ray approaches the horizon.
   * Pairs naturally with SkyAtmosphere — place before it so terrain gets fog too.
   */
  const {
    fogColor = '#c8d8e8',
    density = 4,
    horizonBias = 0,
    order = 0,
  } = defineProps<{
    /** Fog colour */
    fogColor?: string
    /** Controls how quickly fog builds near the horizon — higher = thicker */
    density?: number
    /** Clamp the minimum ray Y used for fog (prevents underground fog) */
    horizonBias?: number
    order?: number
  }>()

  const fogColorNode = useColorProp(() => fogColor)
  const densityNode = useUniformProp(() => density)
  const horizonBiasNode = useUniformProp(() => horizonBias)

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const ray = pipeline.rayNode.value
    const h = ray ? ray.y.max(horizonBiasNode) : horizonBiasNode
    const fogFactor = h.mul(densityNode).negate().exp2()
    return vec4(mix(fogColorNode, prev.xyz, fogFactor), prev.w)
  }, order)
</script>

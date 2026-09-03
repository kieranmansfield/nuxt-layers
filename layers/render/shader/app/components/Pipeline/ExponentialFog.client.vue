<script setup lang="ts">
  import { Color } from 'three'
  import { mix, uniform, vec4 } from 'three/tsl'

  import { hexToVec3Uniform } from '../../utils/tsl/color'

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

  const fogColorNode = hexToVec3Uniform(fogColor)
  const densityNode = uniform(density)
  const horizonBiasNode = uniform(horizonBias)
  watch(
    () => fogColor,
    (v) => {
      const c = new Color(v)
      fogColorNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => density,
    (v) => {
      densityNode.value = v
    }
  )
  watch(
    () => horizonBias,
    (v) => {
      horizonBiasNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const ray = pipeline.rayNode.value
    const h = ray ? ray.y.max(horizonBiasNode) : horizonBiasNode
    const fogFactor = h.mul(densityNode).negate().exp2()
    return vec4(mix(fogColorNode, prev.xyz, fogFactor), prev.w)
  }, order)
</script>

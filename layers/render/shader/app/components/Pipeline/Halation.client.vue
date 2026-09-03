<script setup lang="ts">
  import { Color } from 'three'
  import { float, smoothstep, uniform, vec4 } from 'three/tsl'

  import { luminance } from '../../shaders/common/blend'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

  /**
   * Red/warm glow bleed around highlight areas — the analogue film halation effect.
   * Bright areas bleed a coloured halo into their surroundings.
   */
  const {
    color = '#ff2200',
    threshold = 0.7,
    intensity = 0.4,
    order = 0,
  } = defineProps<{
    /** Glow colour */
    color?: string
    /** Luminance threshold above which glow starts */
    threshold?: number
    /** Glow intensity */
    intensity?: number
    order?: number
  }>()

  const colorNode = hexToVec3Uniform(color)
  const thresholdNode = uniform(threshold)
  const intensityNode = uniform(intensity)
  watch(
    () => color,
    (v) => {
      const c = new Color(v)
      colorNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => threshold,
    (v) => {
      thresholdNode.value = v
    }
  )
  watch(
    () => intensity,
    (v) => {
      intensityNode.value = v
    }
  )

  useShaderStage((prev) => {
    const lum = luminance(prev.xyz)
    const glow = smoothstep(thresholdNode, float(1), lum).mul(intensityNode)
    return vec4(prev.xyz.add(colorNode.mul(glow)), prev.w)
  }, order)
</script>

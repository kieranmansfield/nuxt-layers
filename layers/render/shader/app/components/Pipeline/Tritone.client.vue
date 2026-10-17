<script setup lang="ts">
  import { Color } from 'three'
  import { mix, smoothstep, uniform, vec4 } from 'three/tsl'

  import { luminance } from '../../shaders/common/blend'

  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    midpoint = 0.5,
    shadow = '#0b1020',
    mid = '#7c3aed',
    high = '#fde68a',
    order = 0,
  } = defineProps<{
    /** Luminance of the middle colour (0-1) */
    midpoint?: number
    /** Shadow colour */
    shadow?: string
    /** Midtone colour */
    mid?: string
    /** Highlight colour */
    high?: string
    order?: number
  }>()

  const midpointNode = uniform(midpoint)
  const shadowNode = hexToVec3Uniform(shadow)
  const midNode = hexToVec3Uniform(mid)
  const highNode = hexToVec3Uniform(high)
  watch(
    () => midpoint,
    (v) => {
      midpointNode.value = v
    }
  )
  watch(
    () => shadow,
    (v) => {
      const c = new Color(v)
      shadowNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => mid,
    (v) => {
      const c = new Color(v)
      midNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => high,
    (v) => {
      const c = new Color(v)
      highNode.value.set(c.r, c.g, c.b)
    }
  )

  useShaderStage((prev) => {
    const lum = luminance(prev.xyz)
    const lowMid = mix(shadowNode, midNode, smoothstep(0, midpointNode, lum))
    const out = mix(lowMid, highNode, smoothstep(midpointNode, 1, lum))
    return vec4(out, prev.w)
  }, order)
</script>

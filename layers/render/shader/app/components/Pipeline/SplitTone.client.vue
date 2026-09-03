<script setup lang="ts">
  import { Color } from 'three'
  import { float, smoothstep, uniform, vec4 } from 'three/tsl'

  import { luminance } from '../../shaders/common/blend'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    shadowColor = '#1a2a5a',
    highlightColor = '#ffeecc',
    balance = 0.5,
    opacity = 0.5,
    order = 0,
  } = defineProps<{
    /** Colour pushed into shadow tones */
    shadowColor?: string
    /** Colour pushed into highlight tones */
    highlightColor?: string
    /** Balance point: 0.5 = even split, lower = shadows dominate */
    balance?: number
    /** Overall blend strength */
    opacity?: number
    order?: number
  }>()

  const shadowNode = hexToVec3Uniform(shadowColor)
  const highlightNode = hexToVec3Uniform(highlightColor)
  const balanceNode = uniform(balance)
  const opacityNode = uniform(opacity)
  watch(
    () => shadowColor,
    (v) => {
      const c = new Color(v)
      shadowNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => highlightColor,
    (v) => {
      const c = new Color(v)
      highlightNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => balance,
    (v) => {
      balanceNode.value = v
    }
  )
  watch(
    () => opacity,
    (v) => {
      opacityNode.value = v
    }
  )

  useShaderStage((prev) => {
    const lum = luminance(prev.xyz)
    const shadowMask = smoothstep(balanceNode, float(0), lum)
    const highlightMask = smoothstep(balanceNode, float(1), lum)
    const toned = prev.xyz
      .add(shadowNode.mul(shadowMask).mul(opacityNode))
      .add(highlightNode.mul(highlightMask).mul(opacityNode))
    return vec4(toned, prev.w)
  }, order)
</script>

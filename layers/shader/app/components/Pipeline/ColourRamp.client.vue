<script setup lang="ts">
  import { Color } from 'three'
  import { float, mix, smoothstep, uniform, vec4 } from 'three/tsl'

  import { luminance } from '../../shaders/common/blend'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

  /**
   * Maps input luminance to a three-stop colour ramp: shadow → midtone → highlight.
   * For a simple two-stop ramp use DuoTone instead.
   */
  const {
    shadowColor = '#000033',
    midtoneColor = '#660066',
    highlightColor = '#ffcc88',
    shadowPoint = 0.33,
    highlightPoint = 0.67,
    order = 0,
  } = defineProps<{
    shadowColor?: string
    midtoneColor?: string
    highlightColor?: string
    /** Luminance threshold between shadow and midtone */
    shadowPoint?: number
    /** Luminance threshold between midtone and highlight */
    highlightPoint?: number
    order?: number
  }>()

  const shadowNode = hexToVec3Uniform(shadowColor)
  const midNode = hexToVec3Uniform(midtoneColor)
  const highlightNode = hexToVec3Uniform(highlightColor)
  const shadowPtNode = uniform(shadowPoint)
  const highlightPtNode = uniform(highlightPoint)
  watch(
    () => shadowColor,
    (v) => {
      const c = new Color(v)
      shadowNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => midtoneColor,
    (v) => {
      const c = new Color(v)
      midNode.value.set(c.r, c.g, c.b)
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
    () => shadowPoint,
    (v) => {
      shadowPtNode.value = v
    }
  )
  watch(
    () => highlightPoint,
    (v) => {
      highlightPtNode.value = v
    }
  )

  useShaderStage((prev) => {
    const lum = luminance(prev.xyz)
    const t1 = smoothstep(float(0), shadowPtNode, lum)
    const t2 = smoothstep(shadowPtNode, highlightPtNode, lum)
    const colour = mix(mix(shadowNode, midNode, t1), mix(midNode, highlightNode, t2), t2)
    return vec4(colour, prev.w)
  }, order)
</script>

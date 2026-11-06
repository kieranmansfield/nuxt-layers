<script setup lang="ts">
  import { float, mix, smoothstep, vec4 } from 'three/tsl'

  import { luminance } from '../../shaders/common/blend'

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

  const shadowNode = useColorProp(() => shadowColor)
  const midNode = useColorProp(() => midtoneColor)
  const highlightNode = useColorProp(() => highlightColor)
  const shadowPtNode = useUniformProp(() => shadowPoint)
  const highlightPtNode = useUniformProp(() => highlightPoint)

  useShaderStage((prev) => {
    const lum = luminance(prev.xyz)
    const t1 = smoothstep(float(0), shadowPtNode, lum)
    const t2 = smoothstep(shadowPtNode, highlightPtNode, lum)
    const colour = mix(mix(shadowNode, midNode, t1), mix(midNode, highlightNode, t2), t2)
    return vec4(colour, prev.w)
  }, order)
</script>

<script setup lang="ts">
  import { clamp, float, mix, time, vec3, vec4 } from 'three/tsl'

  import { fbm2D } from '../../shaders/common/noise'

  const {
    colorBase = '#ffcc00',
    colorTip = '#ff2200',
    scale = 3,
    speed = 1.5,
    order = 0,
  } = defineProps<{
    /** Base flame colour (cool, inner) */
    colorBase?: string
    /** Tip flame colour (hot, outer) */
    colorTip?: string
    /** Flame height scale */
    scale?: number
    /** Rise speed */
    speed?: number
    order?: number
  }>()

  const colorBaseNode = useColorProp(() => colorBase)
  const colorTipNode = useColorProp(() => colorTip)
  const scaleNode = useUniformProp(() => scale)
  const speedNode = useUniformProp(() => speed)

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uv = pipeline.uvNode.value
    // Animate upward by subtracting time from Y
    const pos = uv.mul(scaleNode).sub(time.mul(speedNode))
    const n = fbm2D(pos).mul(0.5).add(0.5)
    // Heat = noise * (1 - uv.y): flames die out at the top
    const heat = clamp(n.mul(float(1).sub(uv.y).mul(1.5)), float(0), float(1))
    // Black background → tip colour → base colour
    const fireColor = mix(vec3(0, 0, 0), mix(colorTipNode, colorBaseNode, heat), heat)
    return vec4(fireColor, heat)
  }, order)
</script>

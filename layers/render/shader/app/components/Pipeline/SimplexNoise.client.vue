<script setup lang="ts">
  // fallow-ignore-file code-duplication
  import { float, mix, time, vec2, vec4 } from 'three/tsl'

  import { simplexNoise2D } from '../../shaders/common/noise'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    scale = 3,
    animated = true,
    speed = 0.3,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    scale?: number
    animated?: boolean
    speed?: number
    order?: number
  }>()

  const colorANode = useColorProp(() => colorA)
  const colorBNode = useColorProp(() => colorB)
  const scaleNode = useUniformProp(() => scale)
  const speedNode = useUniformProp(() => speed)

  const { uvNode } = useShaderPipelineContext()

  useShaderStage((_prev) => {
    // Scroll UV over time to animate noise (cheaper than 3D noise)
    const offset = animated ? time.mul(speedNode) : float(0)
    const input = uvNode.value.mul(scaleNode).add(vec2(offset, 0))
    const n = simplexNoise2D(input).mul(0.5).add(0.5)
    return vec4(mix(colorANode, colorBNode, n), 1.0)
  }, order)
</script>

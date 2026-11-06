<script setup lang="ts">
  // fallow-ignore-file code-duplication
  import { float, mix, time, vec2, vec4 } from 'three/tsl'

  import { fbm2D } from '../../shaders/common/noise'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    scale = 3,
    octaves = 5,
    animated = true,
    speed = 0.15,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    scale?: number
    octaves?: number
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
    const offset = animated ? time.mul(speedNode) : float(0)
    const input = uvNode.value.mul(scaleNode).add(vec2(offset, 0))
    const n = fbm2D(input, { octaves: octaves }).mul(0.5).add(0.5)
    return vec4(mix(colorANode, colorBNode, n), 1.0)
  }, order)
</script>

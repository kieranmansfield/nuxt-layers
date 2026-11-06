<script setup lang="ts">
  import { mix, sin, time, vec2, vec4 } from 'three/tsl'

  const {
    color = '#4488ff',
    opacity = 0.8,
    frequency = 3,
    speed = 0.5,
    warpStrength = 0.15,
    order = 0,
  } = defineProps<{
    color?: string
    opacity?: number
    frequency?: number
    speed?: number
    warpStrength?: number
    order?: number
  }>()

  const colorNode = useColorProp(() => color)
  const opacityNode = useUniformProp(() => opacity)
  const freqNode = useUniformProp(() => frequency)
  const speedNode = useUniformProp(() => speed)
  const warpNode = useUniformProp(() => warpStrength)

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const uvCurrent = pipeline.uvNode.value
    if (!prev || !uvCurrent) return vec4(0, 0, 0, 1)

    const t = time.mul(speedNode)

    // Domain warp — pure functional (both x and y use original uvCurrent coords)
    const warpX = uvCurrent.x.add(sin(uvCurrent.y.mul(freqNode).add(t)).mul(warpNode))
    const warpY = uvCurrent.y.add(sin(uvCurrent.x.mul(freqNode).add(t)).mul(warpNode))
    const s = vec2(warpX, warpY)

    const band = sin(s.length().mul(freqNode.mul(4.0)).add(t))
      .mul(0.5)
      .add(0.5)
    const alpha = band.mul(opacityNode)

    return vec4(mix(prev.xyz, colorNode, alpha), prev.w)
  }, order)
</script>

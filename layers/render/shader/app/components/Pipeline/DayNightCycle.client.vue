<script setup lang="ts">
  import { abs, float, mix, pow, sign, time, vec4 } from 'three/tsl'

  /**
   * Sinusoidal interpolation between a light and dark colour over time.
   * The phobon easing: t = (sign(cycle) * pow(abs(cycle), 0.6) + 1) / 2
   * where cycle = sin(time * speed).
   */
  const {
    colorLight = '#ffffff',
    colorDark = '#000033',
    speed = 0.3,
    opacity = 1,
    order = 0,
  } = defineProps<{
    /** Colour during the light phase */
    colorLight?: string
    /** Colour during the dark phase */
    colorDark?: string
    /** Cycle speed in radians per second */
    speed?: number
    /** Mix opacity over prev colour */
    opacity?: number
    order?: number
  }>()

  const lightNode = useColorProp(() => colorLight)
  const darkNode = useColorProp(() => colorDark)
  const speedNode = useUniformProp(() => speed)
  const opacityNode = useUniformProp(() => opacity)

  useShaderStage((prev) => {
    const cycle = time.mul(speedNode).sin()
    const t = sign(cycle)
      .mul(pow(abs(cycle), float(0.6)))
      .add(1)
      .div(2)
    const colour = mix(darkNode, lightNode, t)
    return vec4(mix(prev.xyz, colour, opacityNode), prev.w)
  }, order)
</script>

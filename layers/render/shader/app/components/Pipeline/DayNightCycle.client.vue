<script setup lang="ts">
  import { Color } from 'three'
  import { abs, float, mix, pow, sign, time, uniform, vec4 } from 'three/tsl'

  import { hexToVec3Uniform } from '../../utils/tsl/color'

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

  const lightNode = hexToVec3Uniform(colorLight)
  const darkNode = hexToVec3Uniform(colorDark)
  const speedNode = uniform(speed)
  const opacityNode = uniform(opacity)
  watch(
    () => colorLight,
    (v) => {
      const c = new Color(v)
      lightNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => colorDark,
    (v) => {
      const c = new Color(v)
      darkNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => speed,
    (v) => {
      speedNode.value = v
    }
  )
  watch(
    () => opacity,
    (v) => {
      opacityNode.value = v
    }
  )

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

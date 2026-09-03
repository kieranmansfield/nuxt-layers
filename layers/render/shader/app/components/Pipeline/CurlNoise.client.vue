<script setup lang="ts">
  import { Color } from 'three'
  import { mix, time, uniform, vec3, vec4 } from 'three/tsl'

  import { curlNoise3d } from '../../shaders/common/noise'
  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    color = '#ffffff',
    opacity = 1,
    scale = 1.5,
    speed = 0.2,
    order = 0,
  } = defineProps<{
    /** Colour to mix in at curl peak */
    color?: string
    /** Blend opacity */
    opacity?: number
    /** Input scale for the curl noise */
    scale?: number
    /** Animation speed */
    speed?: number
    order?: number
  }>()

  const colorNode = hexToVec3Uniform(color)
  const opacityNode = uniform(opacity)
  const scaleNode = uniform(scale)
  const speedNode = uniform(speed)
  watch(
    () => color,
    (v) => {
      const c = new Color(v)
      colorNode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => opacity,
    (v) => {
      opacityNode.value = v
    }
  )
  watch(
    () => scale,
    (v) => {
      scaleNode.value = v
    }
  )
  watch(
    () => speed,
    (v) => {
      speedNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage((prev) => {
    const uvCurrent = pipeline.uvNode.value
    const t = time.mul(speedNode)
    const p = vec3(uvCurrent.mul(scaleNode), t)
    const curl = curlNoise3d(p).x.mul(0.5).add(0.5)
    const blended = mix(prev.xyz, colorNode, curl.mul(opacityNode))
    return vec4(blended, prev.w)
  }, order)
</script>

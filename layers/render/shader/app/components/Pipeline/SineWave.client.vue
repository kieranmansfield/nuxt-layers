<script setup lang="ts">
  import { Color } from 'three'
  import { abs, float, mix, sin, smoothstep, time, uniform, vec4 } from 'three/tsl'

  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    amplitude = 0.15,
    frequency = 6,
    speed = 1,
    thickness = 0.02,
    colorA = '#020617',
    colorB = '#22d3ee',
    order = 0,
  } = defineProps<{
    /** Wave height (UV) */
    amplitude?: number
    /** Wave count across the width */
    frequency?: number
    /** Scroll speed */
    speed?: number
    /** Line half-thickness (UV) */
    thickness?: number
    /** Background colour */
    colorA?: string
    /** Foreground colour */
    colorB?: string
    order?: number
  }>()

  const amplitudeNode = uniform(amplitude)
  const frequencyNode = uniform(frequency)
  const speedNode = uniform(speed)
  const thicknessNode = uniform(thickness)
  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
  watch(
    () => amplitude,
    (v) => {
      amplitudeNode.value = v
    }
  )
  watch(
    () => frequency,
    (v) => {
      frequencyNode.value = v
    }
  )
  watch(
    () => speed,
    (v) => {
      speedNode.value = v
    }
  )
  watch(
    () => thickness,
    (v) => {
      thicknessNode.value = v
    }
  )
  watch(
    () => colorA,
    (v) => {
      const c = new Color(v)
      colorANode.value.set(c.r, c.g, c.b)
    }
  )
  watch(
    () => colorB,
    (v) => {
      const c = new Color(v)
      colorBNode.value.set(c.r, c.g, c.b)
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const p = pipeline.uvNode.value
    const y = float(0.5).add(sin(p.x.mul(frequencyNode).add(time.mul(speedNode))).mul(amplitudeNode))
    const d = abs(p.y.sub(y))
    const mask = float(1).sub(smoothstep(thicknessNode, thicknessNode.mul(1.6), d))
    return vec4(mix(colorANode, colorBNode, mask), 1.0)
  }, order)
</script>

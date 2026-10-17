<script setup lang="ts">
  import { Color } from 'three'
  import { abs, atan, float, fract, length, mix, smoothstep, time, uniform, vec4 } from 'three/tsl'

  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    turns = 6,
    thickness = 0.5,
    speed = 0.2,
    softness = 0.05,
    colorA = '#0f172a',
    colorB = '#f472b6',
    order = 0,
  } = defineProps<{
    /** Spiral arms per unit radius */
    turns?: number
    /** Arm thickness (0-1) */
    thickness?: number
    /** Rotation speed (turns/second) */
    speed?: number
    /** Edge softness */
    softness?: number
    /** Background colour */
    colorA?: string
    /** Foreground colour */
    colorB?: string
    order?: number
  }>()

  const turnsNode = uniform(turns)
  const thicknessNode = uniform(thickness)
  const speedNode = uniform(speed)
  const softnessNode = uniform(softness)
  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
  watch(
    () => turns,
    (v) => {
      turnsNode.value = v
    }
  )
  watch(
    () => thickness,
    (v) => {
      thicknessNode.value = v
    }
  )
  watch(
    () => speed,
    (v) => {
      speedNode.value = v
    }
  )
  watch(
    () => softness,
    (v) => {
      softnessNode.value = v
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
    const p = pipeline.uvNode.value.sub(0.5)
    const angle = atan(p.y, p.x).div(Math.PI * 2)
    const t = fract(length(p).mul(turnsNode).sub(angle).sub(time.mul(speedNode)))
    const d = abs(t.sub(0.5)).mul(2)
    const mask = float(1).sub(smoothstep(thicknessNode.sub(softnessNode), thicknessNode.add(softnessNode), d))
    return vec4(mix(colorANode, colorBNode, mask), 1.0)
  }, order)
</script>

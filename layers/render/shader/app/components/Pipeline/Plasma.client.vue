<script setup lang="ts">
  import { Color } from 'three'
  import { mix, sin, time, uniform, vec4 } from 'three/tsl'

  import { hexToVec3Uniform } from '../../utils/tsl/color'

  const {
    scale = 6,
    speed = 0.6,
    colorA = '#1e1b4b',
    colorB = '#f0abfc',
    order = 0,
  } = defineProps<{
    /** Pattern scale */
    scale?: number
    /** Animation speed */
    speed?: number
    /** Background colour */
    colorA?: string
    /** Foreground colour */
    colorB?: string
    order?: number
  }>()

  const scaleNode = uniform(scale)
  const speedNode = uniform(speed)
  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
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
    const p = pipeline.uvNode.value.mul(scaleNode)
    const t = time.mul(speedNode)
    const v = sin(p.x.add(t))
      .add(sin(p.y.mul(1.3).add(t.mul(1.2))))
      .add(sin(p.x.add(p.y).mul(0.8).add(t.mul(0.7))))
      .add(sin(p.x.mul(p.x).add(p.y.mul(p.y)).sqrt().mul(1.5).sub(t)))
    const k = v.mul(0.125).add(0.5)
    return vec4(mix(colorANode, colorBNode, k), 1.0)
  }, order)
</script>

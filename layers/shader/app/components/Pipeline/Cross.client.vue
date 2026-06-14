<script setup lang="ts">
  import { Color, Vector3 } from 'three'
  import { float, mix, smoothstep, uniform, vec4 } from 'three/tsl'

  import { sdBox2d } from '../../shaders/common/sdf'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    size = 0.4,
    thickness = 0.1,
    softness = 0.01,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    /** Length of each arm */
    size?: number
    /** Width of each arm */
    thickness?: number
    softness?: number
    order?: number
  }>()

  function toVec3Node(hex: string) {
    const c = new Color(hex)
    return uniform(new Vector3(c.r, c.g, c.b))
  }

  const colorANode = toVec3Node(colorA)
  const colorBNode = toVec3Node(colorB)
  const sizeNode = uniform(size)
  const thickNode = uniform(thickness)
  const softnessNode = uniform(softness)
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
  watch(
    () => size,
    (v) => {
      sizeNode.value = v
    }
  )
  watch(
    () => thickness,
    (v) => {
      thickNode.value = v
    }
  )
  watch(
    () => softness,
    (v) => {
      softnessNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uv = pipeline.uvNode.value
    const p = uv.sub(0.5)
    // Horizontal arm and vertical arm — union = min
    const dH = sdBox2d(p, thickNode.div(2)) // approx — sdBox2d expects a scalar half-size
    const dV = sdBox2d(p.yx, thickNode.div(2))
    const d = dH.min(dV)
    const mask = smoothstep(softnessNode, softnessNode.negate(), d)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  }, order)
</script>

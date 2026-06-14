<script setup lang="ts">
  import { Color, Vector3 } from 'three'
  import { float, mix, uniform, vec4 } from 'three/tsl'

  import { stripes } from '../../shaders/common/shapes'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    frequency = 10,
    thickness = 0.5,
    angle = 0,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    frequency?: number
    /** Fraction of each stripe that is colorB (0–1) */
    thickness?: number
    /** Angle in degrees */
    angle?: number
    order?: number
  }>()

  function toVec3Node(hex: string) {
    const c = new Color(hex)
    return uniform(new Vector3(c.r, c.g, c.b))
  }

  const colorANode = toVec3Node(colorA)
  const colorBNode = toVec3Node(colorB)
  const freqNode = uniform(frequency)
  const thickNode = uniform(thickness)
  const angleNode = uniform((angle * Math.PI) / 180)
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
    () => frequency,
    (v) => {
      freqNode.value = v
    }
  )
  watch(
    () => thickness,
    (v) => {
      thickNode.value = v
    }
  )
  watch(
    () => angle,
    (v) => {
      angleNode.value = (v * Math.PI) / 180
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uv = pipeline.uvNode.value
    const mask = stripes(uv, freqNode, thickNode, angleNode)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  }, order)
</script>

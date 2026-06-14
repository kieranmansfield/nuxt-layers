<script setup lang="ts">
  import { Color, Vector3 } from 'three'
  import { float, mix, smoothstep, uniform, vec4 } from 'three/tsl'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    radius = 0.35,
    softness = 0.01,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    radius?: number
    softness?: number
    order?: number
  }>()

  function toVec3Node(hex: string) {
    const c = new Color(hex)
    return uniform(new Vector3(c.r, c.g, c.b))
  }

  const colorANode = toVec3Node(colorA)
  const colorBNode = toVec3Node(colorB)
  const radiusNode = uniform(radius)
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
    () => radius,
    (v) => {
      radiusNode.value = v
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
    const d = uv.sub(0.5).length()
    const mask = smoothstep(radiusNode.add(softnessNode), radiusNode.sub(softnessNode), d)
    return vec4(mix(colorANode, colorBNode, mask), float(1))
  }, order)
</script>

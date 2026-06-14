<script setup lang="ts">
  import { Color, Vector3 } from 'three'
  import { float, mix, uniform, vec4 } from 'three/tsl'

  const {
    colorA = '#000000',
    colorB = '#ffffff',
    rotation = 0,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    /** Rotation offset in degrees */
    rotation?: number
    order?: number
  }>()

  function toVec3Node(hex: string) {
    const c = new Color(hex)
    return uniform(new Vector3(c.r, c.g, c.b))
  }

  const colorANode = toVec3Node(colorA)
  const colorBNode = toVec3Node(colorB)
  const rotationNode = uniform((rotation * Math.PI) / 180)
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
    () => rotation,
    (v) => {
      rotationNode.value = (v * Math.PI) / 180
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uv = pipeline.uvNode.value
    const centered = uv.sub(0.5)
    const angle = centered.y.atan(centered.x).add(rotationNode)
    const t = angle.div(Math.PI * 2).fract()
    return vec4(mix(colorANode, colorBNode, t), float(1))
  }, order)
</script>

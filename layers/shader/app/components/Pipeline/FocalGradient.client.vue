<script setup lang="ts">
  import { Color, Vector2, Vector3 } from 'three'
  import { float, mix, uniform, vec2, vec4 } from 'three/tsl'

  /** Radial gradient with an offset focal point — asymmetric radial. */
  const {
    colorA = '#ffffff',
    colorB = '#000000',
    focal = [0.3, 0.3],
    radius = 1.2,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    /** Focal point in UV space [0,1] */
    focal?: [number, number]
    /** Radius of full falloff */
    radius?: number
    order?: number
  }>()

  function toVec3Node(hex: string) {
    const c = new Color(hex)
    return uniform(new Vector3(c.r, c.g, c.b))
  }

  const colorANode = toVec3Node(colorA)
  const colorBNode = toVec3Node(colorB)
  const focalNode = uniform(new Vector2(...focal))
  const radiusNode = uniform(radius)
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
    () => focal,
    ([x, y]) => {
      focalNode.value.set(x, y)
    }
  )
  watch(
    () => radius,
    (v) => {
      radiusNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uv = pipeline.uvNode.value
    const t = uv.sub(vec2(focalNode.x, focalNode.y)).length().div(radiusNode).min(float(1))
    return vec4(mix(colorANode, colorBNode, t), float(1))
  }, order)
</script>

<script setup lang="ts">
  import { Color, Vector3 } from 'three'
  import { float, mix, uniform, vec4 } from 'three/tsl'

  /** Chebyshev-distance diamond gradient: max(|x|, |y|) from centre. */
  const {
    colorA = '#000000',
    colorB = '#ffffff',
    scale = 1,
    order = 0,
  } = defineProps<{
    colorA?: string
    colorB?: string
    /** Scale — higher = faster falloff */
    scale?: number
    order?: number
  }>()

  function toVec3Node(hex: string) {
    const c = new Color(hex)
    return uniform(new Vector3(c.r, c.g, c.b))
  }

  const colorANode = toVec3Node(colorA)
  const colorBNode = toVec3Node(colorB)
  const scaleNode = uniform(scale)
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
    () => scale,
    (v) => {
      scaleNode.value = v
    }
  )

  const pipeline = useShaderPipelineContext()

  useShaderStage(() => {
    const uv = pipeline.uvNode.value
    const centered = uv.sub(0.5).abs()
    const t = centered.x.max(centered.y).mul(scaleNode).mul(2).min(float(1))
    return vec4(mix(colorANode, colorBNode, t), float(1))
  }, order)
</script>

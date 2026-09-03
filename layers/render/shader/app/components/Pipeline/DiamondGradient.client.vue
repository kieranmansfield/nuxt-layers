<script setup lang="ts">
  import { Color } from 'three'
  import { float, mix, uniform, vec4 } from 'three/tsl'

  import { hexToVec3Uniform } from '../../utils/tsl/color'

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

  const colorANode = hexToVec3Uniform(colorA)
  const colorBNode = hexToVec3Uniform(colorB)
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

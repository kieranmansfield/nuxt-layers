<script setup lang="ts">
  import { float } from 'three/tsl'

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

  const scaleNode = useUniformProp(() => scale)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const centered = uv.sub(0.5).abs()
      const t = centered.x.max(centered.y).mul(scaleNode).mul(2).min(float(1))
      return t
    },
    order
  )
</script>

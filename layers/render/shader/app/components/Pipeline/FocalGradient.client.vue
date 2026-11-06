<script setup lang="ts">
  import { float, vec2 } from 'three/tsl'

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

  const focalNode = useVector2Prop(() => focal)
  const radiusNode = useUniformProp(() => radius)

  useColorMixStage(
    () => colorA,
    () => colorB,
    (uv) => {
      const t = uv.sub(vec2(focalNode.x, focalNode.y)).length().div(radiusNode).min(float(1))
      return t
    },
    order
  )
</script>

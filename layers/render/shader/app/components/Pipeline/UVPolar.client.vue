<script setup lang="ts">
  import { uniform, vec2 } from 'three/tsl'

  import { toPolar } from '../../shaders/common/uv'

  const {
    centerX = 0.5,
    centerY = 0.5,
    radialScale = 2,
    order = 0,
  } = defineProps<{
    /** Centre X */
    centerX?: number
    /** Centre Y */
    centerY?: number
    /** Radius scale */
    radialScale?: number
    order?: number
  }>()

  const centerXNode = uniform(centerX)
  const centerYNode = uniform(centerY)
  const radialScaleNode = uniform(radialScale)
  watch(
    () => centerX,
    (v) => {
      centerXNode.value = v
    }
  )
  watch(
    () => centerY,
    (v) => {
      centerYNode.value = v
    }
  )
  watch(
    () => radialScale,
    (v) => {
      radialScaleNode.value = v
    }
  )

  useShaderStage((uvIn) => {
    const polar = toPolar(uvIn, vec2(centerXNode, centerYNode))
    // x = angle around the centre (0-1), y = radius
    return vec2(polar.y, polar.x.mul(radialScaleNode))
  }, order, 'uv')
</script>

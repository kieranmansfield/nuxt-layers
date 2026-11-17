<script setup lang="ts">
  import { useWindowMouseUniform } from '../../composables/useWindowMouseUniform'
  import { rotateVec3X, rotateVec3Y } from '../../shaders/common/math'

  const {
    yawRange = Math.PI,
    pitchRange = Math.PI / 3,
    order = 0,
  } = defineProps<{
    /** Multiplier for horizontal mouse sweep → yaw range (radians) */
    yawRange?: number
    /** Multiplier for vertical mouse sweep → pitch range (radians) */
    pitchRange?: number
    order?: number
  }>()

  const mouse = useWindowMouseUniform()

  const yawRangeNode = useUniformProp(() => yawRange)
  const pitchRangeNode = useUniformProp(() => pitchRange)

  useShaderStage(
    (ray) => {
      const yaw = mouse.x.sub(0.5).mul(yawRangeNode)
      const pitch = mouse.y.sub(0.5).mul(pitchRangeNode)
      return rotateVec3X(rotateVec3Y(ray, yaw), pitch)
    },
    order,
    'ray'
  )
</script>

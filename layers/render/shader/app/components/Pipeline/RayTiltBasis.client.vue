<script setup lang="ts">
  import { cos, sin, vec3 } from 'three/tsl'

  import { rotateVec3X, rotateVec3Y } from '../../shaders/common/math'

  const {
    yaw = 0,
    pitch = 0,
    roll = 0,
    order = 0,
  } = defineProps<{
    /** Yaw offset in radians (horizontal look) */
    yaw?: number
    /** Pitch offset in radians (vertical tilt) */
    pitch?: number
    /** Roll offset in radians */
    roll?: number
    order?: number
  }>()

  const yawNode = useUniformProp(() => yaw)
  const pitchNode = useUniformProp(() => pitch)
  const rollNode = useUniformProp(() => roll)

  useShaderStage(
    (ray) => {
      const r2 = rotateVec3X(rotateVec3Y(ray, yawNode), pitchNode)

      // Roll (Z)
      const cr = cos(rollNode)
      const sr = sin(rollNode)
      return vec3(r2.x.mul(cr).sub(r2.y.mul(sr)), r2.x.mul(sr).add(r2.y.mul(cr)), r2.z)
    },
    order,
    'ray'
  )
</script>

<template>
  <slot />
</template>

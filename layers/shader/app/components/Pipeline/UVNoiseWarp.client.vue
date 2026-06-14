<script setup lang="ts">
  import { time, uniform, vec2 } from 'three/tsl'

  import { fbm2D } from '../../shaders/common/noise'

  const {
    strength = 0.3,
    scale = 2,
    speed = 0.2,
    order = 0,
  } = defineProps<{
    /** Warp strength in UV units */
    strength?: number
    /** Noise input scale */
    scale?: number
    /** Animation speed */
    speed?: number
    order?: number
  }>()

  const strengthNode = uniform(strength)
  const scaleNode = uniform(scale)
  const speedNode = uniform(speed)
  watch(
    () => strength,
    (v) => {
      strengthNode.value = v
    }
  )
  watch(
    () => scale,
    (v) => {
      scaleNode.value = v
    }
  )
  watch(
    () => speed,
    (v) => {
      speedNode.value = v
    }
  )

  useShaderStage(
    (uvIn) => {
      const t = time.mul(speedNode)
      const warpX = fbm2D(uvIn.mul(scaleNode).add(t))
      const warpY = fbm2D(uvIn.mul(scaleNode).add(vec2(5.2, 1.3)).add(t))
      return uvIn.add(vec2(warpX, warpY).mul(strengthNode))
    },
    order,
    'uv'
  )
</script>

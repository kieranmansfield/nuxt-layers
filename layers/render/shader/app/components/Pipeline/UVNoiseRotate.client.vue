<script setup lang="ts">
  import { time, uniform, vec2 } from 'three/tsl'

  import { simplexNoise2D } from '../../shaders/common/noise'

  const {
    rotationAmount = 720,
    speed = 0.1,
    noiseScale = 1,
    order = 0,
  } = defineProps<{
    /** Max rotation in degrees (default 720 = 2 full turns) */
    rotationAmount?: number
    /** Noise animation speed */
    speed?: number
    /** Noise spatial frequency */
    noiseScale?: number
    order?: number
  }>()

  const rotAmountNode = uniform(rotationAmount)
  const speedNode = uniform(speed)
  const noiseScaleNode = uniform(noiseScale)

  watch(
    () => rotationAmount,
    (v) => {
      rotAmountNode.value = v
    }
  )
  watch(
    () => speed,
    (v) => {
      speedNode.value = v
    }
  )
  watch(
    () => noiseScale,
    (v) => {
      noiseScaleNode.value = v
    }
  )

  const DEG_TO_RAD = Math.PI / 180

  useShaderStage(
    (uvIn) => {
      // Sample gradient noise at animated position: (time*speed, uv.x*uv.y) * noiseScale
      const noiseInput = vec2(time.mul(speedNode), uvIn.x.mul(uvIn.y)).mul(noiseScaleNode)
      const n = simplexNoise2D(noiseInput)
      // Remap noise to angle: (n*0.5) * rotAmount + 180 degrees, avoids snapping to 0
      const angleDeg = n.mul(0.5).mul(rotAmountNode).add(180.0)
      const angle = angleDeg.mul(DEG_TO_RAD)

      const pivot = vec2(0.5, 0.5)
      const cosA = angle.cos()
      const sinA = angle.sin()
      const centered = uvIn.sub(pivot)
      return vec2(
        centered.x.mul(cosA).sub(centered.y.mul(sinA)),
        centered.x.mul(sinA).add(centered.y.mul(cosA))
      ).add(pivot)
    },
    order,
    'uv'
  )
</script>

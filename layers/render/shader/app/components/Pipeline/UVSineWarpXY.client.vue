<script setup lang="ts">
  import { time, uniform, vec2 } from 'three/tsl'

  /**
   * Asymmetric sine warp — the core Grainient/Shadertoy UV distortion.
   *   tuv.x += sin(tuv.y * freq + time * speed) / amplitude
   *   tuv.y += sin(tuv.x * freq * 1.5 + time * speed) / (amplitude * 0.5)
   * The 1.5× frequency on Y and halved amplitude on Y are intentional — they give
   * the characteristic flowing, non-repeating Grainient look.
   */
  const {
    frequency = 5,
    amplitude = 30,
    speed = 2,
    order = 0,
  } = defineProps<{
    frequency?: number
    amplitude?: number
    speed?: number
    order?: number
  }>()

  const freqNode = uniform(frequency)
  const ampNode = uniform(amplitude)
  const speedNode = uniform(speed)

  watch(
    () => frequency,
    (v) => {
      freqNode.value = v
    }
  )
  watch(
    () => amplitude,
    (v) => {
      ampNode.value = v
    }
  )
  watch(
    () => speed,
    (v) => {
      speedNode.value = v
    }
  )

  // Pure expression — no toVar/addAssign needed, so no Fn() stack required.
  // Sequential dependency preserved: warpedY uses warpedX (the already-warped X component).
  useShaderStage(
    (uvIn) => {
      const t = time.mul(speedNode)
      const warpedX = uvIn.x.add(uvIn.y.mul(freqNode).add(t).sin().div(ampNode))
      const warpedY = uvIn.y.add(warpedX.mul(freqNode).mul(1.5).add(t).sin().div(ampNode.mul(0.5)))
      return vec2(warpedX, warpedY)
    },
    order,
    'uv'
  )
</script>

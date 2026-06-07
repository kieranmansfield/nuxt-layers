import type { MaybeRef } from 'vue'

interface VelocityMapping {
  input: [number, number]
  output: [number, number]
}

interface UseMarqueeVelocityOptions {
  damping?: MaybeRef<number>
  stiffness?: MaybeRef<number>
  velocityMapping?: MaybeRef<VelocityMapping>
}

export function useMarqueeVelocity(opts: UseMarqueeVelocityOptions = {}) {
  const { velocity: rawVelocity } = useSmoothScroll()
  const { gsap } = useGsap()

  const smoothVelocity = ref(0)
  const velocityFactor = ref(0)

  function tick() {
    const damping = (unref(opts.damping) ?? 50) / 1000
    const stiffness = (unref(opts.stiffness) ?? 400) / 1000
    const mapping: VelocityMapping = unref(opts.velocityMapping) ?? {
      input: [0, 1000],
      output: [0, 5],
    }

    smoothVelocity.value += (rawVelocity.value - smoothVelocity.value) * stiffness
    smoothVelocity.value *= 1 - damping

    const inputRange = mapping.input[1] - mapping.input[0]
    const outputRange = mapping.output[1] - mapping.output[0]
    let t = (Math.abs(smoothVelocity.value) - mapping.input[0]) / inputRange
    t = Math.max(0, Math.min(1, t))
    velocityFactor.value = mapping.output[0] + t * outputRange
    if (smoothVelocity.value < 0) velocityFactor.value *= -1
  }

  onMounted(() => gsap.ticker.add(tick))
  onUnmounted(() => gsap.ticker.remove(tick))

  return { velocityFactor }
}

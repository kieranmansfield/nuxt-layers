import type { MaybeRef } from 'vue'

export function useCursorFollower(opts: { smoothing?: MaybeRef<number> } = {}) {
  const { gsap } = useGsap()
  const { x: mouseX, y: mouseY } = useMouse({ type: 'client' })

  const reduced = useReducedMotion()

  const x = ref(0)
  const y = ref(0)

  function tick() {
    // Reduced motion: track the pointer exactly instead of trailing it
    const factor = reduced.value ? 1 : (unref(opts.smoothing) ?? 0.15)
    x.value += (mouseX.value - x.value) * factor
    y.value += (mouseY.value - y.value) * factor
  }

  onMounted(() => {
    x.value = mouseX.value
    y.value = mouseY.value
    gsap.ticker.add(tick)
  })

  onUnmounted(() => gsap.ticker.remove(tick))

  return { x, y }
}

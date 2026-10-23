export function resolvePointerSpring(
  current: number,
  target: number,
  options: {
    damping?: number
    stiffness?: number
  } = {}
) {
  const damping = options.damping ?? 0
  const stiffness = options.stiffness ?? 0
  const next = current + (target - current) * stiffness
  return next * (1 - damping)
}

export function usePointerMotionFrame(update: () => void, cleanup?: () => void) {
  const { gsap } = useGsap()
  const reduced = useReducedMotion()

  // Checked per frame so a reduced-motion toggle applies live; reduced holds the element at rest.
  // ponytail: cleanup re-runs every frame while reduced — cheap gsap.set, gate it if it ever shows up in a profile
  const frame = () => (reduced.value ? cleanup?.() : update())

  onMounted(() => {
    gsap.ticker.add(frame)
  })

  onUnmounted(() => {
    gsap.ticker.remove(frame)
    cleanup?.()
  })

  return { gsap }
}

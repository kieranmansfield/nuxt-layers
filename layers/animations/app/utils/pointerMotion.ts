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

export function usePointerMotionFrame(
  update: () => void,
  cleanup?: () => void
) {
  const { gsap } = useGsap()

  onMounted(() => {
    gsap.ticker.add(update)
  })

  onUnmounted(() => {
    gsap.ticker.remove(update)
    cleanup?.()
  })

  return { gsap }
}

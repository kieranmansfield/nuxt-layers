export function useMagneticElement(
  elementRef: Ref<HTMLElement | null>,
  opts: {
    strength?: number
    radius?: number
    damping?: number
    stiffness?: number
  } = {}
) {
  const { gsap } = useGsap()
  const { elementX, elementY, elementWidth, elementHeight } = useMouseInElement(elementRef)

  const currentX = ref(0)
  const currentY = ref(0)
  const isActive = ref(false)

  function tick() {
    const strength = opts.strength ?? 0.3
    const radius = opts.radius ?? 100
    const damping = (opts.damping ?? 30) / 1000
    const stiffness = (opts.stiffness ?? 300) / 1000

    const dx = elementX.value - elementWidth.value / 2
    const dy = elementY.value - elementHeight.value / 2
    const dist = Math.sqrt(dx * dx + dy * dy)

    let targetX = 0
    let targetY = 0

    if (dist < radius) {
      isActive.value = true
      targetX = dx * strength
      targetY = dy * strength
    } else {
      isActive.value = false
    }

    currentX.value += (targetX - currentX.value) * stiffness
    currentX.value *= 1 - damping
    currentY.value += (targetY - currentY.value) * stiffness
    currentY.value *= 1 - damping

    if (elementRef.value) {
      gsap.set(elementRef.value, { x: currentX.value, y: currentY.value })
    }
  }

  onMounted(() => gsap.ticker.add(tick))

  onUnmounted(() => {
    gsap.ticker.remove(tick)
    if (elementRef.value) gsap.set(elementRef.value, { x: 0, y: 0 })
  })

  return { isActive }
}

export function useTiltEffect(
  elementRef: Ref<HTMLElement | null>,
  opts: {
    maxTilt?: number
    perspective?: number
    damping?: number
    stiffness?: number
  } = {}
) {
  const { gsap } = useGsap()
  const { elementX, elementY, elementWidth, elementHeight, isOutside } =
    useMouseInElement(elementRef)

  const currentRotateX = ref(0)
  const currentRotateY = ref(0)

  function tick() {
    const maxTilt = opts.maxTilt ?? 15
    const perspective = opts.perspective ?? 800
    const damping = (opts.damping ?? 40) / 1000
    const stiffness = (opts.stiffness ?? 250) / 1000

    const width = elementWidth.value || 1
    const height = elementHeight.value || 1

    let targetRotateX = 0
    let targetRotateY = 0

    if (!isOutside.value) {
      const nx = (elementX.value / width) * 2 - 1
      const ny = (elementY.value / height) * 2 - 1
      targetRotateY = nx * maxTilt
      targetRotateX = -ny * maxTilt
    }

    currentRotateX.value += (targetRotateX - currentRotateX.value) * stiffness
    currentRotateX.value *= 1 - damping
    currentRotateY.value += (targetRotateY - currentRotateY.value) * stiffness
    currentRotateY.value *= 1 - damping

    if (elementRef.value) {
      gsap.set(elementRef.value, {
        rotateX: currentRotateX.value,
        rotateY: currentRotateY.value,
        transformPerspective: perspective,
      })
    }
  }

  onMounted(() => gsap.ticker.add(tick))

  onUnmounted(() => {
    gsap.ticker.remove(tick)
    if (elementRef.value) gsap.set(elementRef.value, { rotateX: 0, rotateY: 0 })
  })

  return { rotateX: currentRotateX, rotateY: currentRotateY }
}

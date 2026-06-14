<script setup lang="ts">
  type EffectType =
    | 'skew'
    | 'scale'
    | 'blur'
    | 'opacity'
    | 'letterSpacing'
    | 'rotate'
    | 'translateY'
    | 'hueRotate'

  const {
    effect,
    intensity = undefined,
    damping = 15,
    stiffness = 150,
    as = 'div',
  } = defineProps<{
    effect: EffectType
    intensity?: number
    damping?: number
    stiffness?: number
    as?: string
  }>()

  const { gsap } = useGsap()
  const { velocity } = useSmoothScroll()

  const smoothVelocity = ref(0)
  const smoothAbsVelocity = ref(0)

  function tick() {
    const d = damping / 1000
    const s = stiffness / 1000

    smoothVelocity.value += (velocity.value - smoothVelocity.value) * s
    smoothVelocity.value *= 1 - d

    smoothAbsVelocity.value += (Math.abs(velocity.value) - smoothAbsVelocity.value) * s
    smoothAbsVelocity.value *= 1 - d

    if (Math.abs(smoothVelocity.value) < 0.01) smoothVelocity.value = 0
    if (smoothAbsVelocity.value < 0.01) smoothAbsVelocity.value = 0
  }

  onMounted(() => gsap.ticker.add(tick))
  onUnmounted(() => gsap.ticker.remove(tick))

  const defaultIntensities: Record<EffectType, number> = {
    skew: 3,
    scale: 0.12,
    blur: 1.5,
    opacity: 0.25,
    letterSpacing: 6,
    rotate: 4,
    translateY: 8,
    hueRotate: 45,
  }

  const activeIntensity = computed(() => intensity ?? defaultIntensities[effect])

  const effectStyle = computed(() => {
    const vel = smoothVelocity.value
    const absVel = smoothAbsVelocity.value
    const int = activeIntensity.value

    switch (effect) {
      case 'skew':
        return { transform: `skewX(${Math.max(-15, Math.min(15, vel * int))}deg)` }
      case 'scale':
        return { transform: `scale(${1 + absVel * int})` }
      case 'blur':
        return { filter: `blur(${absVel * int}px)` }
      case 'opacity':
        return { opacity: Math.max(0.3, 1 - absVel * int) }
      case 'letterSpacing':
        return { letterSpacing: `${absVel * int}px` }
      case 'rotate':
        return { transform: `rotate(${vel * int}deg)` }
      case 'translateY':
        return { transform: `translateY(${vel * -int}px)` }
      case 'hueRotate':
        return { filter: `hue-rotate(${absVel * int}deg)` }
      default:
        return {}
    }
  })

  const effectClasses = computed(() => {
    if (['skew', 'scale', 'rotate', 'translateY'].includes(effect)) {
      return ['will-change-transform']
    }
    return []
  })
</script>

<template>
  <component :is="as" :class="effectClasses" :style="effectStyle">
    <slot />
  </component>
</template>

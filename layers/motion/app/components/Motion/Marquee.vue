<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /**
     * Base animation speed in pixels per second
     */
    speed?: number
    /**
     * Direction of scroll
     */
    direction?: 'left' | 'right'
    /**
     * Pause animation on hover
     */
    pauseOnHover?: boolean
    /**
     * Gap between repeated items
     */
    gap?: string
    /**
     * Enable velocity-based speed (scroll velocity affects marquee speed)
     */
    velocityBased?: boolean
    /**
     * How much scroll velocity affects speed (0-1)
     * 0 = no effect, 1 = velocity fully controls speed
     */
    velocitySensitivity?: number
    /**
     * Reverse direction based on scroll direction
     */
    velocityDirection?: boolean
    /**
     * Minimum speed multiplier when using velocity
     */
    minSpeed?: number
    /**
     * Maximum speed multiplier when using velocity
     */
    maxSpeed?: number
  }>(),
  {
    speed: 50,
    direction: 'left',
    pauseOnHover: true,
    gap: '2rem',
    velocityBased: false,
    velocitySensitivity: 0.5,
    velocityDirection: false,
    minSpeed: 0.2,
    maxSpeed: 5,
  }
)

const { gsap } = useGsap()
const { velocity: scrollVelocity, direction: scrollDirection } = useSmoothScroll()

const containerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const tweenRef = ref<gsap.core.Tween | null>(null)

const isPaused = ref(false)
const currentTimeScale = ref(1)

onMounted(() => {
  if (!containerRef.value || !contentRef.value) return

  const content = contentRef.value
  const contentWidth = content.offsetWidth

  // Set up the infinite scroll animation
  tweenRef.value = gsap.to(content, {
    x: props.direction === 'left' ? -contentWidth / 2 : contentWidth / 2,
    duration: contentWidth / props.speed,
    ease: 'none',
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize((x) => {
        const mod = contentWidth / 2
        return props.direction === 'left' ? parseFloat(x) % mod : -Math.abs(parseFloat(x) % mod)
      }),
    },
  })
})

// Watch velocity changes for velocity-based animation
watch(
  [scrollVelocity, scrollDirection],
  ([vel, dir]) => {
    if (!props.velocityBased || !tweenRef.value || isPaused.value) return

    // Calculate velocity multiplier
    const absVelocity = Math.abs(vel)
    const velocityEffect = absVelocity * props.velocitySensitivity * 0.02

    // Base multiplier from velocity magnitude
    let multiplier = 1 + velocityEffect

    // Clamp to min/max
    multiplier = Math.max(props.minSpeed, Math.min(props.maxSpeed, multiplier))

    // Optionally reverse direction based on scroll direction
    if (props.velocityDirection && dir !== 0) {
      const baseDirection = props.direction === 'left' ? 1 : -1
      multiplier *= dir * baseDirection
    }

    // Smoothly interpolate to target
    gsap.to(currentTimeScale, {
      value: multiplier,
      duration: 0.3,
      ease: 'power2.out',
      onUpdate: () => {
        if (tweenRef.value) {
          tweenRef.value.timeScale(currentTimeScale.value)
        }
      },
    })
  },
  { immediate: false }
)

onUnmounted(() => {
  tweenRef.value?.kill()
})

function handleMouseEnter() {
  if (props.pauseOnHover && tweenRef.value) {
    gsap.to(tweenRef.value, { timeScale: 0, duration: 0.5 })
    isPaused.value = true
  }
}

function handleMouseLeave() {
  if (props.pauseOnHover && tweenRef.value) {
    gsap.to(tweenRef.value, { timeScale: currentTimeScale.value, duration: 0.5 })
    isPaused.value = false
  }
}
</script>

<template>
  <div
    ref="containerRef"
    class="motion-marquee"
    :class="{ 'is-paused': isPaused }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div ref="contentRef" class="motion-marquee__content" :style="{ gap }">
      <slot />
      <!-- Duplicate for seamless loop -->
      <slot />
    </div>
  </div>
</template>

<style scoped>
.motion-marquee {
  width: 100%;
  overflow: hidden;
}

/* stylelint-disable-next-line selector-class-pattern */
.motion-marquee__content {
  display: flex;
  will-change: transform;
  /* stylelint-disable-next-line plugin/no-unsupported-browser-features */
  width: max-content;
}
</style>

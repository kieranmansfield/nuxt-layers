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

const props = withDefaults(
  defineProps<{
    /**
     * Type of velocity effect to apply
     */
    effect: EffectType
    /**
     * Intensity multiplier (default varies by effect type)
     */
    intensity?: number
    /**
     * Whether to use smoothed velocity (recommended)
     */
    smooth?: boolean
    /**
     * Lerp factor for smoothing (0.1 = very smooth, 0.3 = responsive)
     */
    smoothFactor?: number
    /**
     * Tag to render as
     */
    as?: string
  }>(),
  {
    smooth: true,
    smoothFactor: 0.15,
    as: 'div',
  }
)

const { velocity } = useSmoothScroll()

// Smoothed velocity for stable animations
const smoothVelocity = ref(0)
const smoothAbsVelocity = ref(0)
let animationFrame: number | null = null

function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}

function updateSmoothedValues() {
  smoothVelocity.value = lerp(smoothVelocity.value, velocity.value, props.smoothFactor)
  smoothAbsVelocity.value = lerp(
    smoothAbsVelocity.value,
    Math.abs(velocity.value),
    props.smoothFactor
  )

  if (Math.abs(smoothVelocity.value) < 0.01) smoothVelocity.value = 0
  if (smoothAbsVelocity.value < 0.01) smoothAbsVelocity.value = 0

  animationFrame = requestAnimationFrame(updateSmoothedValues)
}

onMounted(() => {
  if (props.smooth) {
    animationFrame = requestAnimationFrame(updateSmoothedValues)
  }
})

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame)
})

// Get the active velocity value
const activeVelocity = computed(() => (props.smooth ? smoothVelocity.value : velocity.value))
const activeAbsVelocity = computed(() =>
  props.smooth ? smoothAbsVelocity.value : Math.abs(velocity.value)
)

// Default intensities per effect type
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

const intensity = computed(() => props.intensity ?? defaultIntensities[props.effect])

// Compute the style based on effect type
const effectStyle = computed(() => {
  const vel = activeVelocity.value
  const absVel = activeAbsVelocity.value
  const int = intensity.value

  switch (props.effect) {
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

// Classes for performance optimization
const effectClasses = computed(() => {
  const classes = []
  if (['skew', 'scale', 'rotate', 'translateY'].includes(props.effect)) {
    classes.push('will-change-transform')
  }
  return classes
})
</script>

<template>
  <component :is="as" :class="effectClasses" :style="effectStyle">
    <slot />
  </component>
</template>

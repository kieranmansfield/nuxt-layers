<!-- eslint-disable compat/compat -->
<script setup lang="ts">
import type { ScrollTrigger as GSAPScrollTrigger } from 'gsap/ScrollTrigger'

interface VelocityMapping {
  input: [number, number]
  output: [number, number]
}

interface ScrollVelocityProps {
  scrollContainerRef?: HTMLElement | null
  texts?: string[]
  velocity?: number
  className?: string
  damping?: number
  stiffness?: number
  velocityMapping?: VelocityMapping
  parallaxClassName?: string
  scrollerClassName?: string
  parallaxStyle?: Record<string, string | number>
  scrollerStyle?: Record<string, string | number>
}

const {
  texts = [],
  velocity = 100,
  className = '',
  damping = 50,
  stiffness = 400,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName = '',
  scrollerClassName = '',
  parallaxStyle = {},
  scrollerStyle = {},
  scrollContainerRef = null,
} = defineProps<ScrollVelocityProps>()

// import { useNuxtApp } from '#app'
// import gsap from 'gsap'

// const { $ScrollTrigger } = useNuxtApp()
// const ScrollTrigger = $ScrollTrigger as typeof GSAPScrollTriggerType

const { gsap, ScrollTrigger } = useGsap()

const containerRef = ref<HTMLDivElement[]>([])
const scrollerRef = ref<HTMLDivElement[]>([])
const copyRefs = ref<HTMLSpanElement[]>([])

const baseX = ref<number[]>([])
const scrollVelocity = ref(0)
const smoothVelocity = ref(0)
const velocityFactor = ref(0)
const copyWidths = ref<number[]>([])
const directionFactors = ref<number[]>([])
const calculatedCopies = ref<number[]>([])

// const rafId: number | null = null
// Use the GSAP ScrollTrigger type for proper typing
let scrollTriggerInstance: GSAPScrollTrigger | null = null
let lastScrollY = 0
// const lastTime = 0
let resizeTimeout: number | null = null

const setCopyRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el && el instanceof HTMLSpanElement) {
    copyRefs.value[index] = el
  }
}

const updateWidths = () => {
  texts.forEach((_, index) => {
    if (copyRefs.value[index] && containerRef.value[index]) {
      const singleCopyWidth = copyRefs.value[index].offsetWidth
      const containerWidth = containerRef.value[index].offsetWidth
      const viewportWidth = window.innerWidth

      const effectiveWidth = Math.max(containerWidth, viewportWidth)
      const minCopies = Math.ceil((effectiveWidth * 2.5) / singleCopyWidth)
      const optimalCopies = Math.max(minCopies, 8)

      copyWidths.value[index] = singleCopyWidth
      calculatedCopies.value[index] = optimalCopies
    }
  })
}

const debouncedUpdateWidths = () => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
  resizeTimeout = window.setTimeout(() => {
    updateWidths()
    resizeTimeout = null
  }, 150)
}

const wrap = (min: number, max: number, v: number): number => {
  const range = max - min
  if (range === 0) return min
  const mod = (((v - min) % range) + range) % range
  return mod + min
}

const scrollTransforms = computed(() => {
  return texts.map((_, index) => {
    const singleWidth = copyWidths.value[index]
    if (singleWidth === undefined || singleWidth === 0) return '0px'
    return `${wrap(-singleWidth, 0, baseX.value[index] || 0)}px`
  })
})

const updateSmoothVelocity = () => {
  const dampingFactor = damping / 1000
  const stiffnessFactor = stiffness / 1000

  const velocityDiff = scrollVelocity.value - smoothVelocity.value
  smoothVelocity.value += velocityDiff * stiffnessFactor
  smoothVelocity.value *= 1 - dampingFactor
}

const updateVelocityFactor = () => {
  const { input, output } = velocityMapping
  const inputRange = input[1] - input[0]
  const outputRange = output[1] - output[0]

  let normalizedVelocity = (Math.abs(smoothVelocity.value) - input[0]) / inputRange
  normalizedVelocity = Math.max(0, Math.min(1, normalizedVelocity))

  velocityFactor.value = output[0] + normalizedVelocity * outputRange
  if (smoothVelocity.value < 0) velocityFactor.value *= -1
}

// const animationTicker: number | null = null
let scrollLastTime = 0
let animLastTime = 0

const animate = () => {
  updateScrollVelocity() // <-- Always update scroll velocity every frame

  const currentTime = performance.now()
  const delta = animLastTime ? currentTime - animLastTime : 16
  animLastTime = currentTime

  updateSmoothVelocity()
  updateVelocityFactor()

  texts.forEach((_, index) => {
    const baseVelocity = index % 2 !== 0 ? -velocity : velocity

    let moveBy = (directionFactors.value[index] || 1) * baseVelocity * (delta / 1000)

    if (velocityFactor.value < 0) {
      directionFactors.value[index] = -1
    } else if (velocityFactor.value > 0) {
      directionFactors.value[index] = 1
    }

    moveBy += (directionFactors.value[index] || 1) * moveBy * velocityFactor.value
    baseX.value[index] = (baseX.value[index] || 0) + moveBy
  })
}

const updateScrollVelocity = () => {
  // Only run on client to avoid SSR hydration mismatch
  if (typeof window === 'undefined') return

  const container = scrollContainerRef || window
  const currentScrollY =
    container === window ? window.scrollY : (container as HTMLElement).scrollTop

  const currentTime = performance.now()
  const timeDelta = scrollLastTime ? currentTime - scrollLastTime : 16

  if (timeDelta > 0) {
    const scrollDelta = currentScrollY - lastScrollY
    scrollVelocity.value = (scrollDelta / timeDelta) * 1000
  }

  lastScrollY = currentScrollY
  scrollLastTime = currentTime
}

onMounted(async () => {
  await nextTick()

  baseX.value = new Array(texts.length).fill(0)
  copyWidths.value = new Array(texts.length).fill(0)
  calculatedCopies.value = new Array(texts.length).fill(15)
  directionFactors.value = new Array(texts.length).fill(1)

  setTimeout(() => {
    updateWidths()
  }, 100)

  updateWidths()
  const scrollTriggerOptions: Record<string, unknown> = {
    trigger: containerRef.value[0],
    start: 'top bottom',
    end: 'bottom top',
  }
  if (scrollContainerRef) {
    scrollTriggerOptions.scroller = scrollContainerRef
  }
  scrollTriggerInstance = ScrollTrigger.create(scrollTriggerOptions)

  // --- Add this block to initialize scroll position and time ---
  const container = scrollContainerRef || window
  lastScrollY = container === window ? window.scrollY : (container as HTMLElement).scrollTop
  scrollLastTime = performance.now()
  // ------------------------------------------------------------

  animLastTime = performance.now()
  gsap.ticker.add(animate)

  window.addEventListener('resize', debouncedUpdateWidths, { passive: true })
})

onUnmounted(() => {
  if (scrollTriggerInstance && typeof scrollTriggerInstance.kill === 'function') {
    scrollTriggerInstance.kill()
  }
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
  window.removeEventListener('resize', debouncedUpdateWidths)
})
</script>

<template>
  <section class="w-full overflow-x-hidden">
    <div
      v-for="(text, index) in texts"
      :key="index"
      ref="containerRef"
      :class="`${parallaxClassName} relative w-full overflow-x-hidden overflow-y-visible`"
      :style="parallaxStyle"
    >
      <div
        ref="scrollerRef"
        :class="`${scrollerClassName} font-styles-logo flex py-2 text-center font-sans text-4xl font-medium tracking-[-0.02em] whitespace-nowrap text-neutral drop-shadow md:text-[5rem] md:leading-[5rem]`"
        :style="{ transform: `translateX(${scrollTransforms[index] || '0px'})`, ...scrollerStyle }"
      >
        <span
          v-for="spanIndex in calculatedCopies[index] || 15"
          :key="spanIndex"
          :ref="spanIndex === 1 ? (el) => setCopyRef(el, index) : undefined"
          :class="`flex-shrink-0 ${className} text-primary-500`"
        >
          {{ text }}&nbsp;
        </span>
      </div>
    </div>
  </section>
</template>

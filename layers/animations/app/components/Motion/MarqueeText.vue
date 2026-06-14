<script setup lang="ts">
  import type { ScrollTrigger as GSAPScrollTrigger } from 'gsap/ScrollTrigger'

  interface VelocityMapping {
    input: [number, number]
    output: [number, number]
  }

  const {
    texts = [],
    velocity = 100,
    className = '',
    damping = 50,
    stiffness = 400,
    velocityMapping = { input: [0, 1000] as [number, number], output: [0, 5] as [number, number] },
    pauseOnHover = false,
    parallaxClassName = '',
    scrollerClassName = '',
    parallaxStyle = {},
    scrollerStyle = {},
  } = defineProps<{
    texts?: string[]
    velocity?: number
    className?: string
    damping?: number
    stiffness?: number
    velocityMapping?: VelocityMapping
    pauseOnHover?: boolean
    parallaxClassName?: string
    scrollerClassName?: string
    parallaxStyle?: Record<string, string | number>
    scrollerStyle?: Record<string, string | number>
  }>()

  const { gsap, ScrollTrigger } = useGsap()
  const { velocityFactor } = useMarqueeVelocity({ damping, stiffness, velocityMapping })

  // const containerRef = ref<HTMLElement[]>([])
  const containerRef = useTemplateRef<HTMLElement[]>([])

  const copyRefs = ref<HTMLSpanElement[]>([])

  const { copyWidths, calculatedCopies } = useMarqueeCopies(
    containerRef,
    copyRefs,
    computed(() => texts.length)
  )

  const baseX = ref<number[]>([])
  const directionFactors = ref<number[]>([])
  const isPaused = ref(false)

  let scrollTriggerInstance: GSAPScrollTrigger | null = null
  let animLastTime = 0

  const wrap = (min: number, max: number, v: number): number => {
    const range = max - min
    if (range === 0) return min
    return ((((v - min) % range) + range) % range) + min
  }

  const scrollTransforms = computed(() =>
    texts.map((_, index) => {
      const singleWidth = copyWidths.value[index]
      if (!singleWidth) return '0px'
      return `${wrap(-singleWidth, 0, baseX.value[index] ?? 0)}px`
    })
  )

  const setCopyRef = (el: Element | ComponentPublicInstance | null, index: number) => {
    if (el instanceof HTMLSpanElement) copyRefs.value[index] = el
  }

  function animate() {
    if (isPaused.value) return

    const now = performance.now()
    const delta = animLastTime ? now - animLastTime : 16
    animLastTime = now

    texts.forEach((_, index) => {
      const baseVelocity = index % 2 !== 0 ? -velocity : velocity
      let moveBy = (directionFactors.value[index] ?? 1) * baseVelocity * (delta / 1000)

      if (velocityFactor.value < 0) {
        directionFactors.value[index] = -1
      } else if (velocityFactor.value > 0) {
        directionFactors.value[index] = 1
      }

      moveBy += (directionFactors.value[index] ?? 1) * moveBy * velocityFactor.value
      baseX.value[index] = (baseX.value[index] ?? 0) + moveBy
    })
  }

  onMounted(async () => {
    await nextTick()

    baseX.value = new Array(texts.length).fill(0)
    directionFactors.value = new Array(texts.length).fill(1)
    animLastTime = performance.now()

    const firstContainer = containerRef.value[0]
    if (firstContainer) {
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: firstContainer,
        start: 'top bottom',
        end: 'bottom top',
      })
    }

    gsap.ticker.add(animate)
  })

  onUnmounted(() => {
    gsap.ticker.remove(animate)
    scrollTriggerInstance?.kill()
  })
</script>

<template>
  <section
    class="w-full overflow-x-hidden"
    @mouseenter="() => (isPaused = pauseOnHover)"
    @mouseleave="() => (isPaused = false)"
  >
    <div
      v-for="(text, index) in texts"
      :key="index"
      ref="containerRef"
      :class="`${parallaxClassName} relative w-full overflow-x-hidden overflow-y-visible`"
      :style="parallaxStyle"
    >
      <div
        :class="`${scrollerClassName} font-styles-logo flex py-2 text-center font-sans text-4xl font-medium tracking-[-0.02em] whitespace-nowrap text-neutral drop-shadow md:text-[5rem] md:leading-20`"
        :style="{ transform: `translateX(${scrollTransforms[index] ?? '0px'})`, ...scrollerStyle }"
      >
        <span
          v-for="spanIndex in calculatedCopies[index] ?? 15"
          :key="spanIndex"
          :ref="spanIndex === 1 ? (el) => setCopyRef(el, index) : undefined"
          :class="`shrink-0 ${className} text-primary-500`"
        >
          {{ text }}&nbsp;
        </span>
      </div>
    </div>
  </section>
</template>

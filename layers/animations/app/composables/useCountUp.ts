import type { MaybeRefOrGetter } from 'vue'
import type { ScrollTrigger as GSAPScrollTrigger } from 'gsap/ScrollTrigger'

type UseCountUpOptions = {
  to: number
  from?: number
  duration?: number
  ease?: string
  format?: (n: number) => string
  once?: boolean
}

export function useCountUp(elementRef: MaybeRefOrGetter<HTMLElement | null>, opts: UseCountUpOptions) {
  const { gsap, ScrollTrigger } = useGsap()

  const displayValue = ref(String(opts.from ?? 0))
  const isComplete = ref(false)

  const format = opts.format ?? ((n: number) => n.toLocaleString())
  const counter = { value: opts.from ?? 0 }

  let scrollTriggerInstance: GSAPScrollTrigger | null = null
  let tween: gsap.core.Tween | null = null

  function startCount() {
    tween = gsap.to(counter, {
      value: opts.to,
      duration: opts.duration ?? 2,
      ease: opts.ease ?? 'power2.out',
      onUpdate: () => {
        displayValue.value = format(Math.round(counter.value))
      },
      onComplete: () => {
        isComplete.value = true
        displayValue.value = format(opts.to)
      },
    })
  }

  onMounted(async () => {
    await nextTick()
    displayValue.value = format(opts.from ?? 0)

    const el = toValue(elementRef)
    if (!el) return

    scrollTriggerInstance = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: opts.once ?? true,
      onEnter: startCount,
    })
  })

  onUnmounted(() => {
    tween?.kill()
    scrollTriggerInstance?.kill()
  })

  return { displayValue, isComplete }
}

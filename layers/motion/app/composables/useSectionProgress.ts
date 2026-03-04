import type { MaybeRef } from 'vue'

interface SectionProgressOptions {
  start?: string
  end?: string
  markers?: boolean
}

/**
 * Section-local scroll progress (0–1) scoped to a given element.
 *
 * @example
 * const sectionRef = ref<HTMLElement | null>(null)
 * const { progress, active, entering, leaving } = useSectionProgress(sectionRef, {
 *   start: 'top top',
 *   end: '+=200%',
 * })
 */
export function useSectionProgress(
  trigger: MaybeRef<HTMLElement | null>,
  options: SectionProgressOptions = {}
) {
  const { ScrollTrigger } = useGsap()
  const { direction } = useSmoothScroll()

  const progress = ref(0)
  const active = ref(false)
  const entering = computed(() => active.value && direction.value > 0)
  const leaving = computed(() => active.value && direction.value < 0)

  let st: { kill: () => void } | null = null

  onMounted(() => {
    const el = unref(trigger)
    if (!el) return

    st = ScrollTrigger.create({
      trigger: el,
      start: options.start ?? 'top top',
      end: options.end ?? '+=100%',
      markers: options.markers ?? false,
      onUpdate: (self) => {
        progress.value = self.progress
      },
      onEnter: () => { active.value = true },
      onLeave: () => { active.value = false },
      onEnterBack: () => { active.value = true },
      onLeaveBack: () => { active.value = false },
    })
  })

  onUnmounted(() => {
    st?.kill()
    st = null
  })

  return { progress, active, entering, leaving }
}

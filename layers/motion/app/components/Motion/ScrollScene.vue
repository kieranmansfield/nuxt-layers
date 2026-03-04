<script setup lang="ts">
import type { ScrollSceneContext } from '../../composables/useScrollSteps'
import { SCROLL_SCENE_KEY } from '../../composables/useScrollSteps'

const {
  name,
  start = 'top top',
  end = '+=200%',
  pin = true,
  scrub = 1,
  markers = false,
} = defineProps<{
  /**
   * Unique name for this scene (for debugging)
   */
  name: string
  /**
   * ScrollTrigger start position
   */
  start?: string
  /**
   * ScrollTrigger end position (e.g. '+=200%' = 2 viewport heights past start)
   */
  end?: string
  /**
   * Pin the section while scroll advances
   */
  pin?: boolean
  /**
   * Scrub smoothness: true | number | false
   */
  scrub?: boolean | number
  /**
   * Show GSAP ScrollTrigger markers (debug)
   */
  markers?: boolean
}>()

const emit = defineEmits<{
  enter: []
  leave: []
  progress: [value: number]
}>()

const { ScrollTrigger } = useGsap()

const containerRef = ref<HTMLElement | null>(null)
const progress = ref(0)
const active = ref(false)

// Step registration
const registeredSteps = ref(new Set<number>())
const stepCount = computed(() =>
  registeredSteps.value.size > 0 ? Math.max(...registeredSteps.value) + 1 : 0
)

function registerStep(index: number) {
  registeredSteps.value = new Set([...registeredSteps.value, index])
}

function unregisterStep(index: number) {
  const next = new Set(registeredSteps.value)
  next.delete(index)
  registeredSteps.value = next
}

provide<ScrollSceneContext>(SCROLL_SCENE_KEY, {
  progress,
  active,
  name,
  stepCount,
  registerStep,
  unregisterStep,
})

let st: { kill: () => void } | null = null

onMounted(() => {
  if (!containerRef.value) return

  st = ScrollTrigger.create({
    trigger: containerRef.value,
    start,
    end,
    pin,
    scrub,
    markers,
    onUpdate: (self) => {
      progress.value = self.progress
      emit('progress', self.progress)
    },
    onEnter: () => {
      active.value = true
      emit('enter')
    },
    onLeave: () => {
      active.value = false
      emit('leave')
    },
    onEnterBack: () => {
      active.value = true
      emit('enter')
    },
    onLeaveBack: () => {
      active.value = false
      emit('leave')
    },
  })
})

onUnmounted(() => {
  st?.kill()
  st = null
})
</script>

<template>
  <div ref="containerRef" class="motion-scroll-scene">
    <slot :progress="progress" :active="active" />
  </div>
</template>

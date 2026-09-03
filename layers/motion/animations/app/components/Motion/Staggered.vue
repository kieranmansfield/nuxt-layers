<script setup lang="ts">
  // Props
  const {
    staggerDelay = 100,
    initialDelay = 0,
    animation = 'fade-in',
  } = defineProps<{
    staggerDelay?: number
    initialDelay?: number
    /**
     * Suffix of a `transitions` layer `animate-*` class (e.g. 'fade-in', 'slide-in-up').
     */
    animation?: string
  }>()

  // State
  const items = ref<HTMLElement[]>([])
  const animatedItems = ref<boolean[]>([])

  // Slots
  const slots = useSlots()

  // Methods
  const setItemRef = (el: HTMLElement | null, index: number) => {
    if (el) {
      items.value[index] = el
      animatedItems.value[index] = false
    }
  }

  // Lifecycle
  onMounted(() => {
    // Animate items with staggered delay
    setTimeout(() => {
      items.value.forEach((item, index) => {
        if (item) {
          setTimeout(
            () => {
              animatedItems.value[index] = true
              item.classList.add(`animate-${animation}`, 'animated')
            },
            initialDelay + index * staggerDelay
          )
        }
      })
    }, 100)
  })
</script>

<template>
  <div class="motion-staggered">
    <slot
      v-for="(_, index) in slots.default?.()"
      :key="index"
      :ref="(el: HTMLElement | null) => setItemRef(el, index)"
      :class="{ animated: animatedItems[index] }"
    />
  </div>
</template>

<style scoped>
  /* stylelint-disable selector-pseudo-class-no-unknown */
  .motion-staggered :deep(.animated) {
    transform: translateY(0);
    opacity: 1;
  }

  .motion-staggered :deep(*) {
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.3s ease-out;
  }
</style>

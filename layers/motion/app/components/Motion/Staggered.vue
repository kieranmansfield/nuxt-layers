<script setup lang="ts">
import { ref, onMounted, useSlots } from 'vue'

// Props
const props = withDefaults(
  defineProps<{
    staggerDelay?: number
    initialDelay?: number
    animation?: string
  }>(),
  {
    staggerDelay: 100,
    initialDelay: 0,
    animation: 'fadeIn',
  }
)

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
        setTimeout(() => {
          animatedItems.value[index] = true
          item.classList.add(`animate-${props.animation}`, 'animated')
        }, props.initialDelay + index * props.staggerDelay)
      }
    })
  }, 100)
})
</script>

<template>
  <div class="motion-staggered">
    <slot
      v-for="(item, index) in slots.default?.()"
      :key="index"
      :ref="(el: HTMLElement | null) => setItemRef(el, index)"
      :class="{ animated: animatedItems[index] }"
    />
  </div>
</template>

<style scoped>
.motion-staggered :deep(.animated) {
  opacity: 1;
  transform: translateY(0);
}

.motion-staggered :deep(*) {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease-out;
}
</style>
<script setup lang="ts">
// Props
const props = withDefaults(
  defineProps<{
    name?: string
    mode?: 'in-out' | 'out-in' | 'default'
    duration?: number
    delay?: number
    easing?: string
  }>(),
  {
    name: 'fade',
    mode: 'default',
    duration: 300,
    delay: 0,
    easing: 'ease-out',
  }
)

// State
const isVisible = ref(false)
const isMounted = ref(false)

// Computed classes
const transitionClass = computed(() => {
  return `transition-${props.name}`
})

const style = computed(() => {
  return {
    transitionDuration: `${props.duration}ms`,
    transitionDelay: `${props.delay}ms`,
    transitionTimingFunction: props.easing,
  }
})

// Lifecycle
onMounted(() => {
  isMounted.value = true
  // Trigger initial animation
  setTimeout(() => {
    isVisible.value = true
  }, 50)
})

// Methods
const enter = (el: Element) => {
  // Handle enter transition
  ;(el as HTMLElement).style.opacity = '0'
  setTimeout(() => {
    ;(el as HTMLElement).style.opacity = '1'
  }, 10)
}

const leave = (el: Element, done: () => void) => {
  // Handle leave transition
  ;(el as HTMLElement).style.opacity = '0'
  setTimeout(done, props.duration)
}
</script>

<template>
  <div class="motion-transition" :class="[transitionClass, { 'is-visible': isVisible }]" :style>
    <slot />
  </div>
</template>

<style scoped>
.motion-transition {
  opacity: 0;
  transition-property: all;
}

.motion-transition.is-visible {
  opacity: 1;
}

.transition-fade {
  transition-property: opacity;
}

.transition-slide {
  transition-property: transform, opacity;
}

.transition-scale {
  transition-property: transform, opacity;
}
</style>

<script setup lang="ts">
  // Props
  const {
    name = 'fade',
    duration = 300,
    delay = 0,
    easing = 'ease-out',
  } = defineProps<{
    name?: string
    duration?: number
    delay?: number
    easing?: string
  }>()

  // State
  const isVisible = ref(false)
  const isMounted = ref(false)

  // Computed classes
  const transitionClass = computed(() => {
    return `transition-${name}`
  })

  const style = computed(() => {
    return {
      transitionDuration: `${duration}ms`,
      transitionDelay: `${delay}ms`,
      transitionTimingFunction: easing,
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

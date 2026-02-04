import { useElementHover, useElementVisibility, useScroll } from '@vueuse/core'
// eslint-disable-next-line no-restricted-imports
import type { Ref } from 'vue'

/**
 * Composable for handling element animations and transitions
 */
export function useMotion(target?: Ref<HTMLElement | null>) {
  // Hover state
  const isHovered = ref(false)

  // Visibility state
  const isVisible = ref(false)

  // Scroll position
  const scroll = ref({ x: 0, y: 0 })

  // Initialize if target is provided
  if (target?.value) {
    isHovered.value = useElementHover(target).value
    isVisible.value = useElementVisibility(target).value

    const scrollResult = useScroll(target)
    scroll.value = {
      x: scrollResult.x.value,
      y: scrollResult.y.value,
    }
  }

  // Animation trigger states
  const animateOnHover = ref(false)
  const animateOnVisible = ref(false)
  const animateOnScroll = ref(false)

  // Trigger functions
  const triggerHoverAnimation = () => {
    animateOnHover.value = true
    setTimeout(() => {
      animateOnHover.value = false
    }, 300)
  }

  const triggerVisibleAnimation = () => {
    animateOnVisible.value = true
  }

  const triggerScrollAnimation = () => {
    animateOnScroll.value = true
  }

  return {
    // States
    isHovered,
    isVisible,
    scroll,
    animateOnHover,
    animateOnVisible,
    animateOnScroll,

    // Methods
    triggerHoverAnimation,
    triggerVisibleAnimation,
    triggerScrollAnimation,
  }
}

/**
 * Composable for managing CSS transitions
 */
export function useTransition() {
  const transitionClasses = ref<string[]>([])

  const addTransition = (className: string) => {
    if (!transitionClasses.value.includes(className)) {
      transitionClasses.value.push(className)
    }
  }

  const removeTransition = (className: string) => {
    const index = transitionClasses.value.indexOf(className)
    if (index > -1) {
      transitionClasses.value.splice(index, 1)
    }
  }

  const clearTransitions = () => {
    transitionClasses.value = []
  }

  return {
    transitionClasses,
    addTransition,
    removeTransition,
    clearTransitions,
  }
}

/**
 * Composable for managing CSS animations
 */
export function useAnimation() {
  const animationClasses = ref<string[]>([])
  const isAnimating = ref(false)

  const addAnimation = (className: string) => {
    if (!animationClasses.value.includes(className)) {
      animationClasses.value.push(className)
      isAnimating.value = true

      // Auto-remove after duration (assuming 300ms)
      setTimeout(() => {
        removeAnimation(className)
        isAnimating.value = false
      }, 300)
    }
  }

  const removeAnimation = (className: string) => {
    const index = animationClasses.value.indexOf(className)
    if (index > -1) {
      animationClasses.value.splice(index, 1)
    }
  }

  const clearAnimations = () => {
    animationClasses.value = []
    isAnimating.value = false
  }

  return {
    animationClasses,
    isAnimating,
    addAnimation,
    removeAnimation,
    clearAnimations,
  }
}

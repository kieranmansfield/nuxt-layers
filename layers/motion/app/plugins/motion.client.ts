import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  // Client-side motion plugin
  console.log('Motion layer plugin initialized')

  // Add global motion utilities
  const motionUtils = {
    // Utility to detect if animations are enabled
    isReducedMotion: () => {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches
      }
      return false
    },

    // Utility to add animation classes with automatic cleanup
    animateElement: (element: HTMLElement, animationClass: string, duration = 300) => {
      element.classList.add(animationClass)
      setTimeout(() => {
        element.classList.remove(animationClass)
      }, duration)
    },

    // Utility to create staggered animations
    staggerAnimate: (elements: HTMLElement[], animationClass: string, staggerDelay = 100) => {
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add(animationClass)
        }, index * staggerDelay)
      })
    },
  }

  // Provide motion utilities globally
  nuxtApp.provide('motion', motionUtils)

  return {
    provide: {
      motion: motionUtils,
    },
  }
})

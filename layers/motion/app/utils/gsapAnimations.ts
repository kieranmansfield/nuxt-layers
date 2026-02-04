import type { gsap as GsapType } from 'gsap'
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger'

type GsapInstance = typeof GsapType
type ScrollTriggerInstance = typeof ScrollTriggerType

/**
 * Create a fade-in animation with scroll trigger
 */
export function createFadeIn(
  gsap: GsapInstance,
  target: string | Element,
  options?: {
    duration?: number
    delay?: number
    y?: number
    start?: string
    toggleActions?: string
  }
) {
  const {
    duration = 1,
    delay = 0,
    y = 30,
    start = 'top 85%',
    toggleActions = 'play none none none',
  } = options ?? {}

  gsap.set(target, { opacity: 0, y })

  return gsap.to(target, {
    opacity: 1,
    y: 0,
    duration,
    delay,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: target,
      start,
      toggleActions,
    },
  })
}

/**
 * Create a parallax effect
 */
export function createParallax(
  gsap: GsapInstance,
  target: string | Element,
  options?: {
    speed?: number
    trigger?: string | Element
  }
) {
  const { speed = 0.5, trigger } = options ?? {}

  return gsap.to(target, {
    y: () => window.innerHeight * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger ?? target,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
}

/**
 * Create a pinned section
 */
export function createPin(
  ScrollTrigger: ScrollTriggerInstance,
  target: string | Element,
  options?: {
    start?: string
    end?: string
    pinSpacing?: boolean
  }
) {
  const { start = 'top top', end = '+=100%', pinSpacing = true } = options ?? {}

  return ScrollTrigger.create({
    trigger: target,
    start,
    end,
    pin: true,
    pinSpacing,
  })
}

/**
 * Create staggered fade-in for multiple elements
 */
export function createStaggeredFadeIn(
  gsap: GsapInstance,
  targets: string | Element[],
  options?: {
    duration?: number
    stagger?: number
    y?: number
    start?: string
  }
) {
  const { duration = 0.8, stagger = 0.1, y = 30, start = 'top 85%' } = options ?? {}

  gsap.set(targets, { opacity: 0, y })

  return gsap.to(targets, {
    opacity: 1,
    y: 0,
    duration,
    stagger,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: typeof targets === 'string' ? targets : targets[0],
      start,
      toggleActions: 'play none none none',
    },
  })
}

import type { InjectionKey } from 'vue'

import type { ScrollSceneContext } from '../types/scroll'

export const SCROLL_SCENE_KEY: InjectionKey<ScrollSceneContext> = Symbol('motionScrollScene')

/** The enclosing MotionScrollScene's context, or null (with a dev warning) outside of one. */
export function useScrollScene(caller: string): ScrollSceneContext | null {
  const scene = inject(SCROLL_SCENE_KEY, null)
  if (import.meta.dev && !scene) {
    console.warn(`[scroll] ${caller} must be used inside a MotionScrollScene.`)
  }
  return scene
}

/**
 * Step/waypoint state tracking — must be used inside a MotionScrollScene.
 *
 * @example
 * const { currentStep, isActive, stepProgress } = useScrollSteps(3)
 */
export function useScrollSteps(total: number) {
  const scene = useScrollScene('useScrollSteps')

  const sceneProgress = computed(() => scene?.progress.value ?? 0)

  const currentStep = computed(() => Math.min(Math.floor(sceneProgress.value * total), total - 1))

  function isActive(index: number): boolean {
    return currentStep.value === index
  }

  function stepProgress(index: number): number {
    const stepSize = 1 / total
    const start = index * stepSize
    return Math.max(0, Math.min(1, (sceneProgress.value - start) / stepSize))
  }

  return { currentStep, isActive, stepProgress }
}

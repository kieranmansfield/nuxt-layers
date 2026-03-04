import type { ComputedRef, Ref } from 'vue'

export const SCROLL_SCENE_KEY = Symbol('motionScrollScene')

export interface ScrollSceneContext {
  progress: Ref<number>
  active: Ref<boolean>
  name: string
  stepCount: ComputedRef<number>
  registerStep: (index: number) => void
  unregisterStep: (index: number) => void
}

/**
 * Step/waypoint state tracking — must be used inside a MotionScrollScene.
 *
 * @example
 * const { currentStep, isActive, stepProgress } = useScrollSteps(3)
 * // currentStep: 0 | 1 | 2 based on scene progress
 */
export function useScrollSteps(total: number) {
  const scene = inject<ScrollSceneContext>(SCROLL_SCENE_KEY)

  const sceneProgress = computed(() => scene?.progress.value ?? 0)

  const currentStep = computed(() =>
    Math.min(Math.floor(sceneProgress.value * total), total - 1)
  )

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

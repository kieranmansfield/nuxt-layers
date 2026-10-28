import type { ComputedRef, Ref } from 'vue'

import type { MotionDuration } from '#layers/core/app/types/tokens'

export type ScrollToOptions = {
  offset?: number | undefined
  /** Milliseconds, or a duration token. Locomotive takes seconds; converted at the call. */
  duration?: MotionDuration | number | undefined
  immediate?: boolean | undefined
  lock?: boolean | undefined
  onComplete?: (() => void) | undefined
}

export type SectionProgressOptions = {
  start?: string
  end?: string
  markers?: boolean
}

export type ScrollSceneContext = {
  progress: Ref<number>
  active: Ref<boolean>
  name: string
  stepCount: ComputedRef<number>
  registerStep: (index: number) => void
  unregisterStep: (index: number) => void
}

export type ScrollState = {
  scroll: number
  limit: number
  velocity: number
  direction: number
  progress: number
}

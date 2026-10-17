import type { ComputedRef, Ref } from 'vue'

export type ScrollToOptions = {
  offset?: number | undefined
  duration?: number | undefined
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

/** @consumers motion, layout, shader */
export interface MotionConfig {
  duration: number
  ease: string
  delay?: number
}

/** @consumers motion, layout */
export interface TransitionConfig extends MotionConfig {
  enterFrom?: Record<string, string | number>
  enterTo?: Record<string, string | number>
  leaveFrom?: Record<string, string | number>
  leaveTo?: Record<string, string | number>
}

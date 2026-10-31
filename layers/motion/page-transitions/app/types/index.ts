import type { Flip } from 'gsap/Flip'
import type { gsap } from 'gsap'

export type PageTransitionDirection = 'forward' | 'back'

/** The overlay element presets draw into (wipes, shutters, pixel grids). */
export type PageOverlay = {
  /** Rebuild the overlay as a `cols` × `rows` grid of cells and return them. */
  fill: (cols: number, rows: number) => HTMLElement[]
  cells: () => HTMLElement[]
}

export type PageTransitionContext = {
  gsap: typeof gsap
  Flip: typeof Flip
  /** Seconds per phase (leave and enter each take this long). */
  duration: number
  /** `back` on browser back/forward-to-previous, so slides can reverse. */
  direction: PageTransitionDirection
  overlay: PageOverlay
  /** Scratch space shared between this navigation's leave and enter (e.g. a Flip state). */
  store: Record<string, unknown>
}

type Hook = (el: HTMLElement, ctx: PageTransitionContext) => gsap.core.Animation | void

export type PageTransitionPreset = {
  /** `default` runs leave and enter together (Barba "sync"). */
  mode?: 'out-in' | 'in-out' | 'default'
  /** Use Vue's CSS classes (`<name>-enter-active` …) from page-transitions.css, no JS. */
  css?: boolean
  /** Milliseconds per phase. Falls back to `app.config.pageTransitions.duration`. */
  duration?: number
  leave?: Hook
  enter?: Hook
}

export type PageTransitionChoice = {
  name: string
  duration?: number | undefined
}

export type PageTransitionRule = {
  /** Path prefix of the page being left. Omit to match any. */
  from?: string
  /** Path prefix of the page being entered. Omit to match any. */
  to?: string
} & PageTransitionChoice

declare module '#app' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- augmentation must merge
  interface PageMeta {
    /** Preset (and optional duration) used when navigating to this page. */
    pageTransitionPreset?: string | PageTransitionChoice
  }
}

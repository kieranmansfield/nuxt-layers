import type { Component, CSSProperties } from 'vue'

// Relative, not the '#layers/core' alias: the SFC compiler's macro type
// resolution (defineProps<ElementProps>() in Element.vue) walks tsconfig
// "paths" directly and doesn't see Nuxt's generated layer aliases outside
// a running Nuxt instance — a plain relative import resolves everywhere.
import type { LayoutAttrsInput } from '../composables/useLayoutAttrs'

// `| undefined` on each is explicit (not just `?`) so component prop objects
// — which have it too, under exactOptionalPropertyTypes — are assignable here.
export type ElementProps = LayoutAttrsInput & {
  as?: string | Component
  // Escape hatch for prop names that collide with Element's own (e.g. `color`
  // is Element's raw-CSS text colour, but also UBadge's semantic colour prop).
  // Non-colliding component props still reach `as` for free via attrs fallthrough.
  componentProps?: Record<string, unknown>

  // Display mode — priority hidden > grid > flex > block
  block?: boolean | undefined
  flex?: boolean | undefined
  grid?: boolean | undefined
  hidden?: boolean | undefined

  // Grid container tracks (numbers become `repeat(n, 1fr)`; only applied when `grid` is set)
  cols?: number | string | undefined
  rows?: number | string | undefined

  // Sizing
  w?: CSSProperties['width'] | undefined
  h?: CSSProperties['height'] | undefined
  minW?: CSSProperties['minWidth'] | undefined
  maxW?: CSSProperties['maxWidth'] | undefined
  minH?: CSSProperties['minHeight'] | undefined
  maxH?: CSSProperties['maxHeight'] | undefined
  aspect?: CSSProperties['aspectRatio'] | undefined

  // Surface
  bg?: CSSProperties['background'] | undefined
  color?: CSSProperties['color'] | undefined
  border?: CSSProperties['border'] | undefined
  radius?: CSSProperties['borderRadius'] | undefined
  shadow?: CSSProperties['boxShadow'] | undefined

  // Interaction
  cursor?: CSSProperties['cursor'] | undefined
  select?: CSSProperties['userSelect'] | undefined
  pointer?: CSSProperties['pointerEvents'] | undefined
}

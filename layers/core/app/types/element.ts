import type { Component, CSSProperties } from 'vue'

// Relative, not the '#layers/core' alias: the SFC compiler's macro type
// resolution (defineProps<ElementProps>() in Element.vue) walks tsconfig
// "paths" directly and doesn't see Nuxt's generated layer aliases outside
// a running Nuxt instance — a plain relative import resolves everywhere.
import type { FlexAttrsInput, SpacingAttrsInput } from '../composables/useLayoutAttrs'

// Element's vocabulary as named prop sets, so any component can take the ones it needs
// (`defineProps<AsProps & SpacingProps & { … }>()`) and forward them to <Element>.
// `| undefined` on each is explicit (not just `?`) so component prop objects
// — which have it too, under exactOptionalPropertyTypes — are assignable here.

/** The polymorphic root: a tag name or a component. */
export type AsProps = {
  as?: string | Component | undefined
}

/** Spacing tokens — p/px/py/m/mx/my. Fluid by design (spec §15), so token-only. */
export type SpacingProps = SpacingAttrsInput

/** Flex/grid container alignment — gap/align/justify. Token-only, like SpacingProps. */
export type FlexProps = FlexAttrsInput

/** Display mode — priority hidden > grid > flex > block */
export type DisplayProps = {
  block?: boolean | undefined
  flex?: boolean | undefined
  grid?: boolean | undefined
  hidden?: boolean | undefined
}

/** Grid container tracks (numbers become `repeat(n, 1fr)`; only applied when `grid` is set) */
export type GridTrackProps = {
  cols?: number | string | undefined
  rows?: number | string | undefined
}

export type SizingProps = {
  w?: CSSProperties['width'] | undefined
  h?: CSSProperties['height'] | undefined
  minW?: CSSProperties['minWidth'] | undefined
  maxW?: CSSProperties['maxWidth'] | undefined
  minH?: CSSProperties['minHeight'] | undefined
  maxH?: CSSProperties['maxHeight'] | undefined
  aspect?: CSSProperties['aspectRatio'] | undefined
}

/**
 * Raw CSS surface values. `fg` is the text colour: it was `color` before v7, renamed so
 * `color` can mean the semantic UI colour everywhere else (as it does on Nuxt UI).
 */
export type SurfaceProps = {
  bg?: CSSProperties['background'] | undefined
  fg?: CSSProperties['color'] | undefined
  border?: CSSProperties['border'] | undefined
  radius?: CSSProperties['borderRadius'] | undefined
  shadow?: CSSProperties['boxShadow'] | undefined
}

export type InteractionProps = {
  cursor?: CSSProperties['cursor'] | undefined
  select?: CSSProperties['userSelect'] | undefined
  pointer?: CSSProperties['pointerEvents'] | undefined
}

/** Everything that styles one box: spacing, sizing, surface and interaction. */
export type BoxProps = SpacingProps & SizingProps & SurfaceProps & InteractionProps

export type ElementProps = AsProps &
  DisplayProps &
  GridTrackProps &
  FlexProps &
  BoxProps & {
    // Escape hatch for prop names that collide with Element's own (e.g. a component's own
    // `bg` or `select` prop). Non-colliding component props still reach `as` for free via
    // attrs fallthrough.
    componentProps?: Record<string, unknown>
  }

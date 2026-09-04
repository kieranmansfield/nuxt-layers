import type { Component } from 'vue'

import type { ElementGridProps } from '../composables/useElementGrid'
import type { ElementInteractionProps } from '../composables/useElementInteraction'
import type { ElementLayoutProps } from '../composables/useElementLayout'
import type { ElementSizingProps } from '../composables/useElementSizing'
import type { ElementSurfaceProps } from '../composables/useElementSurface'
// Relative, not the '#layers/core' alias: the SFC compiler's macro type
// resolution (defineProps<ElementProps>() in Element.vue) walks tsconfig
// "paths" directly and doesn't see Nuxt's generated layer aliases outside
// a running Nuxt instance — a plain relative import resolves everywhere.
import type { LayoutAttrsInput } from '../composables/useLayoutAttrs'

export type ElementProps = ElementLayoutProps &
  ElementGridProps &
  LayoutAttrsInput &
  ElementSizingProps &
  ElementSurfaceProps &
  ElementInteractionProps & {
    as?: string | Component
    // Escape hatch for prop names that collide with Element's own (e.g. `color`
    // is Element's raw-CSS text colour, but also UBadge's semantic colour prop).
    // Non-colliding component props still reach `as` for free via attrs fallthrough.
    componentProps?: Record<string, unknown>
  }

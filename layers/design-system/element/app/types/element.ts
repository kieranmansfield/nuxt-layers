import type { Component } from 'vue'

// Relative, not the '#layers/core' alias: the SFC compiler's macro type
// resolution (defineProps<ElementProps>() in Element.vue) walks tsconfig
// "paths" directly and doesn't see Nuxt's generated layer aliases outside
// a running Nuxt instance — a plain relative import resolves everywhere.
import type { LayoutAttrsInput } from '../../../../core/app/composables/useLayoutAttrs'

import type { ElementGridProps } from '../composables/useElementGrid'
import type { ElementInteractionProps } from '../composables/useElementInteraction'
import type { ElementLayoutProps } from '../composables/useElementLayout'
import type { ElementSizingProps } from '../composables/useElementSizing'
import type { ElementSurfaceProps } from '../composables/useElementSurface'

export type ElementProps = ElementLayoutProps &
  ElementGridProps &
  LayoutAttrsInput &
  ElementSizingProps &
  ElementSurfaceProps &
  ElementInteractionProps & {
    as?: string | Component
  }

import type { Component } from 'vue'

import type { LayoutAttrsInput } from '../composables/useLayoutAttrs'
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

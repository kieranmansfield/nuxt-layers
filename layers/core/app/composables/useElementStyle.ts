import { computed, type ComputedRef, type CSSProperties } from 'vue'

import { useLayoutAttrs } from './useLayoutAttrs'
import { useElementGrid } from './useElementGrid'
import { useElementInteraction } from './useElementInteraction'
import { useElementLayout } from './useElementLayout'
import { useElementSizing } from './useElementSizing'
import { useElementSurface } from './useElementSurface'
import type { ElementProps } from '../types/element'

/**
 * Merges the 5 element composables + core's useLayoutAttrs into one style
 * object — the vocabulary shared by both Element (inline :style) and
 * ElementTw (Tailwind arbitrary-property classes). Takes a getter (not the
 * values directly) so callers can pass their own destructured defineProps
 * bindings and keep reactivity, same as useLayoutAttrs's own getter param.
 */
export function useElementStyle(
  getProps: () => Omit<ElementProps, 'as' | 'componentProps'>
): ComputedRef<CSSProperties> {
  return computed(() => {
    const props = getProps()
    return {
      ...useElementLayout({
        block: props.block,
        flex: props.flex,
        grid: props.grid,
        hidden: props.hidden,
      }),
      ...useLayoutAttrs(() => ({
        gap: props.gap,
        align: props.align,
        justify: props.justify,
        p: props.p,
        px: props.px,
        py: props.py,
        m: props.m,
        mx: props.mx,
        my: props.my,
      })).style.value,
      ...useElementGrid({ grid: props.grid, cols: props.cols, rows: props.rows }),
      ...useElementSizing({
        w: props.w,
        h: props.h,
        minW: props.minW,
        maxW: props.maxW,
        minH: props.minH,
        maxH: props.maxH,
        aspect: props.aspect,
      }),
      ...useElementSurface({
        bg: props.bg,
        color: props.color,
        border: props.border,
        radius: props.radius,
        shadow: props.shadow,
      }),
      ...useElementInteraction({ cursor: props.cursor, select: props.select, pointer: props.pointer }),
    }
  })
}

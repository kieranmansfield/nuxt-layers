import type { CSSProperties } from 'vue'

import { resolveLayoutAttrsStyle } from '../composables/useLayoutAttrs'
import type { ElementProps } from '../types/element'

export type ElementStyleInput = Omit<ElementProps, 'as' | 'componentProps'>

const DISPLAY_FOR = {
  hidden: 'none',
  grid: 'grid',
  flex: 'flex',
  block: 'block',
} as const

function track(value: number | string | undefined): string | undefined {
  return typeof value === 'number' ? `repeat(${value}, 1fr)` : value
}

/**
 * Element's whole prop vocabulary → one CSSProperties object. Pure: shared by Element
 * (inline :style) and ElementTw (Tailwind arbitrary-property classes).
 *
 * Grid is container axis only ("I am a grid"). Item placement lives in the layout layer
 * (buildGridPlacementStyle); Element is in core and can't depend on layout.
 */
export function resolveElementStyle(props: ElementStyleInput): CSSProperties {
  // hidden > grid > flex > block
  const mode = (['hidden', 'grid', 'flex', 'block'] as const).find((m) => props[m])
  return {
    display: mode && DISPLAY_FOR[mode],
    ...resolveLayoutAttrsStyle(props),
    ...(props.grid && {
      gridTemplateColumns: track(props.cols),
      gridTemplateRows: track(props.rows),
    }),
    width: props.w,
    height: props.h,
    minWidth: props.minW,
    maxWidth: props.maxW,
    minHeight: props.minH,
    maxHeight: props.maxH,
    aspectRatio: props.aspect,
    background: props.bg,
    color: props.color,
    border: props.border,
    borderRadius: props.radius,
    boxShadow: props.shadow,
    cursor: props.cursor,
    userSelect: props.select,
    pointerEvents: props.pointer,
  }
}

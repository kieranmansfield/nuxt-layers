import type { CSSProperties } from 'vue'

export interface ElementSurfaceProps {
  bg?: CSSProperties['background']
  color?: CSSProperties['color']
  border?: CSSProperties['border']
  radius?: CSSProperties['borderRadius']
  shadow?: CSSProperties['boxShadow']
}

export function useElementSurface(
  props: ElementSurfaceProps,
): Partial<CSSProperties> {
  return {
    background: props.bg,
    color: props.color,
    border: props.border,
    borderRadius: props.radius,
    boxShadow: props.shadow,
  }
}

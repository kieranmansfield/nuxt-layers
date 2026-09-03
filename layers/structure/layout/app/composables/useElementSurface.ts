import type { CSSProperties } from 'vue'

// `| undefined` on each is explicit (not just `?`) so component prop objects
// — which have it too, under exactOptionalPropertyTypes — are assignable here.
export interface ElementSurfaceProps {
  bg?: CSSProperties['background'] | undefined
  color?: CSSProperties['color'] | undefined
  border?: CSSProperties['border'] | undefined
  radius?: CSSProperties['borderRadius'] | undefined
  shadow?: CSSProperties['boxShadow'] | undefined
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

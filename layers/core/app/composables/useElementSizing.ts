import type { CSSProperties } from 'vue'

// `| undefined` on each is explicit (not just `?`) so component prop objects
// — which have it too, under exactOptionalPropertyTypes — are assignable here.
export type ElementSizingProps = {
  w?: CSSProperties['width'] | undefined
  h?: CSSProperties['height'] | undefined
  minW?: CSSProperties['minWidth'] | undefined
  maxW?: CSSProperties['maxWidth'] | undefined
  minH?: CSSProperties['minHeight'] | undefined
  maxH?: CSSProperties['maxHeight'] | undefined
  aspect?: CSSProperties['aspectRatio'] | undefined
}

export function useElementSizing(
  props: ElementSizingProps,
): Partial<CSSProperties> {
  return {
    width: props.w,
    height: props.h,
    minWidth: props.minW,
    maxWidth: props.maxW,
    minHeight: props.minH,
    maxHeight: props.maxH,
    aspectRatio: props.aspect,
  }
}

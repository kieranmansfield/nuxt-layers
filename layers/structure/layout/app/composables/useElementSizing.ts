import type { CSSProperties } from 'vue'

export interface ElementSizingProps {
  w?: CSSProperties['width']
  h?: CSSProperties['height']
  minW?: CSSProperties['minWidth']
  maxW?: CSSProperties['maxWidth']
  minH?: CSSProperties['minHeight']
  maxH?: CSSProperties['maxHeight']
  aspect?: CSSProperties['aspectRatio']
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

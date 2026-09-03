import type { CSSProperties } from 'vue'

export interface ElementInteractionProps {
  cursor?: CSSProperties['cursor']
  select?: CSSProperties['userSelect']
  pointer?: CSSProperties['pointerEvents']
}

export function useElementInteraction(
  props: ElementInteractionProps,
): Partial<CSSProperties> {
  return {
    cursor: props.cursor,
    userSelect: props.select,
    pointerEvents: props.pointer,
  }
}

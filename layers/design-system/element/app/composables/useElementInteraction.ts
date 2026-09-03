import type { CSSProperties } from 'vue'

// `| undefined` on each is explicit (not just `?`) so component prop objects
// — which have it too, under exactOptionalPropertyTypes — are assignable here.
export type ElementInteractionProps = {
  cursor?: CSSProperties['cursor'] | undefined
  select?: CSSProperties['userSelect'] | undefined
  pointer?: CSSProperties['pointerEvents'] | undefined
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

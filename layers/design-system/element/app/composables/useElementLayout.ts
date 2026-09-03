import type { CSSProperties } from 'vue'

// `| undefined` on each is explicit (not just `?`) so component prop objects
// — which have it too, under exactOptionalPropertyTypes — are assignable here.
export type ElementLayoutProps = {
  block?: boolean | undefined
  flex?: boolean | undefined
  grid?: boolean | undefined
  hidden?: boolean | undefined
}

type Mode = 'hidden' | 'grid' | 'flex' | 'block'

const DISPLAY_FOR: Record<Mode, CSSProperties['display']> = {
  hidden: 'none',
  grid: 'grid',
  flex: 'flex',
  block: 'block',
}

export function useElementLayout(props: ElementLayoutProps): Partial<CSSProperties> {
  const mode = (['hidden', 'grid', 'flex', 'block'] as const).find((m) => props[m])
  return {
    display: mode && DISPLAY_FOR[mode],
  }
}

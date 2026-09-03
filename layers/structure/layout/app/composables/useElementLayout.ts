import type { CSSProperties } from 'vue'

export interface ElementLayoutProps {
  block?: boolean
  flex?: boolean
  grid?: boolean
  hidden?: boolean
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

import type { PageTransitionChoice, PageTransitionRule } from '../types'

type Input = {
  /** One-shot from `setTransition()`. */
  override?: PageTransitionChoice | null
  /** From the clicked `[data-transition]` link. */
  link?: PageTransitionChoice | null
  /** From `definePageMeta({ pageTransitionPreset })` on the target page. */
  meta?: string | PageTransitionChoice | undefined
  rules?: PageTransitionRule[] | undefined
  from: string
  to: string
  fallback: PageTransitionChoice
}

const prefix = (path: string, p?: string) => !p || p === '*' || path.startsWith(p)

/** Priority: setTransition() > clicked link > page meta > first matching rule > default. */
export function resolvePageTransition(i: Input): PageTransitionChoice {
  const meta = typeof i.meta === 'string' ? { name: i.meta } : i.meta
  const rule = i.rules?.find((r) => prefix(i.from, r.from) && prefix(i.to, r.to))
  return i.override ?? i.link ?? meta ?? rule ?? i.fallback
}

/**
 * Pure decision logic pinned down from the removed `useScrollGuard` composable
 * before deletion (see `2026-08-30-layer-taxonomy-tier-0-1-design.md`). Kept as
 * a characterization test subject only — nothing imports this in production.
 */

export function shouldExclude(matches: (selector: string) => boolean, excludeSelectors: string[]): boolean {
  return excludeSelectors.some((sel) => {
    try {
      return matches(sel)
    } catch {
      return false
    }
  })
}

export function isOverflowing(scrollWidth: number, viewportWidth: number): boolean {
  return scrollWidth > viewportWidth
}

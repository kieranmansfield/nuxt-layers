/**
 * Lifts an item's custom frontmatter onto the item itself. Collections are declared without a
 * schema (see the layer CLAUDE.md), so Nuxt Content files every non-standard field — `date`,
 * `tags`, `image`, `colors`, `stack`, … — under `meta`, while `types/collections.d.ts` and every
 * component read them top-level. Fields already top-level win; `meta` is left in place.
 */
export function hoistFrontmatter<T>(item: T): T {
  if (!item || typeof item !== 'object') return item
  const meta = (item as { meta?: unknown }).meta
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) return item
  return { ...meta, ...item }
}

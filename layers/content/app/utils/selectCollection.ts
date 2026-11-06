export type CollectionSelection<T> = {
  tags?: string[] | undefined
  limit?: number | undefined
  /** Frontmatter field to sort by (e.g. 'date', 'year'). Duck-typed — missing on an item sorts last. */
  sortKey?: string | undefined
  sortDirection?: 'asc' | 'desc' | undefined
  /** Extra domain-specific predicate (e.g. exclude drafts, require featured). */
  filter?: ((item: T) => boolean) | undefined
}

function fieldValue(item: object, key: string): unknown {
  return key in item ? (item as Record<string, unknown>)[key] : undefined
}

function itemTags(item: object): string[] {
  return 'tags' in item ? ((item.tags as string[] | undefined) ?? []) : []
}

// fallow-ignore-next-line complexity
function compareField(a: object, b: object, key: string, direction: 'asc' | 'desc'): number {
  const av = fieldValue(a, key) as string | number | null | undefined
  const bv = fieldValue(b, key) as string | number | null | undefined
  if (av === bv) return 0
  if (av === undefined || av === null) return 1
  if (bv === undefined || bv === null) return -1
  const cmp = av > bv ? 1 : -1
  return direction === 'desc' ? -cmp : cmp
}

/** Sort, filter and limit a collection's items. Returns a new array; the input is left alone. */
// fallow-ignore-next-line complexity
export function selectCollection<T extends object>(
  items: readonly T[],
  { tags, limit, sortKey, sortDirection = 'desc', filter }: CollectionSelection<T> = {}
): T[] {
  let selected = [...items]
  if (sortKey) selected.sort((a, b) => compareField(a, b, sortKey, sortDirection))
  if (filter) selected = selected.filter(filter)
  if (tags?.length) {
    selected = selected.filter((item) => itemTags(item).some((tag) => tags.includes(tag)))
  }
  return limit ? selected.slice(0, limit) : selected
}

import type { PortfolioQueryOptions } from '../types/content'
import { useCollectionItems } from './useCollectionItems'

export function usePortfolioItems(options: PortfolioQueryOptions = {}) {
  const { featured, tags, limit } = options

  return useCollectionItems({
    key: 'portfolio-items',
    collection: 'portfolio',
    sort: (a, b) => (b.year ?? 0) - (a.year ?? 0),
    options: { limit },
    // fallow-ignore-next-line complexity
    filter: (item) =>
      (featured === undefined || item.featured === featured) &&
      (!tags?.length || Boolean(item.tags?.some((tag: string) => tags.includes(tag)))),
  })
}

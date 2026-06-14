import type { PortfolioQueryOptions } from '../types/content'

export function usePortfolioItems(options: PortfolioQueryOptions = {}) {
  const { featured, tags, limit } = options

  return useContentData('portfolio-items', async () => {
    let items = (await queryCollection('portfolio').all()).sort(
      (a, b) => (b.year ?? 0) - (a.year ?? 0)
    )

    if (featured !== undefined) {
      items = items.filter((item) => item.featured === featured)
    }

    if (tags?.length) {
      items = items.filter((item) => item.tags?.some((tag: string) => tags.includes(tag)))
    }

    if (limit) {
      items = items.slice(0, limit)
    }

    return items
  })
}

import type { PortfolioQueryOptions } from '../types/content'

export function usePortfolioItems(options: PortfolioQueryOptions = {}) {
  const { featured, tags, limit } = options

  return useAsyncData('portfolio-items', async () => {
    let items = await queryCollection('portfolio').order('year', 'DESC').all()

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

// @ts-nocheck
import type { PortfolioQueryOptions } from '../types/content'

export function createPortfolioComposables(collectionName: string) {
  function useItems(options: PortfolioQueryOptions = {}) {
    const { featured, tags, limit } = options

    return useContentData(`${collectionName}-items`, async () => {
      let items = await queryCollection(collectionName).order('year', 'DESC').all()

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

  function useItem(slug: string) {
    return useCollectionItem(collectionName, slug)
  }

  return { useItems, useItem }
}

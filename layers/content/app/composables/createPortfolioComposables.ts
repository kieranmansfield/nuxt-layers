import type { Collections } from '@nuxt/content'

import type { PortfolioQueryOptions } from '../types/content'

type CollectionItem = Collections[keyof Collections]

function itemYear(item: CollectionItem): number {
  return 'year' in item ? (item.year ?? 0) : 0
}

function itemFeatured(item: CollectionItem): boolean {
  return 'featured' in item ? (item.featured ?? false) : false
}

function itemTags(item: CollectionItem): string[] {
  return 'tags' in item ? (item.tags ?? []) : []
}

export function createPortfolioComposables(collectionName: keyof Collections) {
  function useItems(options: PortfolioQueryOptions = {}) {
    const { featured, tags, limit } = options

    return useContentData(`${collectionName}-items`, async () => {
      let items: CollectionItem[] = (await queryCollection(collectionName).all()).sort(
        (a, b) => itemYear(b) - itemYear(a)
      )

      if (featured !== undefined) {
        items = items.filter((item) => itemFeatured(item) === featured)
      }

      if (tags?.length) {
        items = items.filter((item) => itemTags(item).some((tag) => tags.includes(tag)))
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

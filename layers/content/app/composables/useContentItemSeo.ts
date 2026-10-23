import type { Collections } from '@nuxt/content'

/**
 * Page meta for a content item. Called by the *Page components rather than the detail
 * organisms, so an organism never sets page meta. Shares useCollectionItem's cache key with
 * the organism that renders the item.
 *
 * Meta is registered before anything is awaited — Nuxt's instance is gone after an `await`
 * inside a plain composable. Returns the async data so the caller can `await` it.
 */
export function useContentItemSeo(collection: keyof Collections, slug: string) {
  const result = useCollectionItem(collection, slug)
  useSeoMeta({
    title: () => result.data.value?.title,
    description: () => result.data.value?.description,
    ogImage: () => (result.data.value as { image?: string } | null)?.image,
  })
  return result
}
